using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Infrastructure.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OllamaSharp;

namespace AITravelPlanner.Infrastructure.ExternalServices;

public class OllamaService : IAIService
{
    private readonly OllamaOptions _options;
    private readonly ILogger<OllamaService> _logger;
    private readonly HttpClient _httpClient;
    private readonly OllamaApiClient _ollamaClient;

    public OllamaService(
        IOptions<OllamaOptions> options,
        ILogger<OllamaService> logger,
        HttpClient httpClient)
    {
        _options = options.Value;
        _logger = logger;
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(_options.Endpoint);
        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);
        _ollamaClient = new OllamaApiClient(new Uri(_options.Endpoint), _options.ChatModel);
    }

    public async Task<TripConstraints> ExtractConstraintsAsync(string prompt, CancellationToken ct = default)
    {
        _logger.LogInformation("Extracting travel constraints from prompt using Ollama ({Model})", _options.ChatModel);

        var fallback = ParseConstraintsFromText(prompt);

        try
        {
            var systemMessage =
                "You are an expert travel AI parser. Extract structured constraints from the user's travel request into a pure JSON object.\n" +
                "JSON format:\n" +
                "{\n" +
                "  \"fromCity\": \"origin city or Kolkata if omitted\",\n" +
                "  \"destination\": \"destination name or null if user hasn't chosen\",\n" +
                "  \"budgetInRupees\": 30000,\n" +
                "  \"nights\": 2,\n" +
                "  \"travellers\": 2,\n" +
                "  \"interests\": \"keywords like beach, hills, tea, food, adventure\",\n" +
                "  \"weatherPreference\": \"e.g. avoid heavy rain, pleasant\",\n" +
                "  \"notes\": \"any special preferences\"\n" +
                "}\n" +
                "Output ONLY valid raw JSON with NO markdown code fences and NO additional prose.";

            var requestBody = new
            {
                model = _options.ChatModel,
                messages = new[]
                {
                    new { role = "system", content = systemMessage },
                    new { role = "user", content = prompt }
                },
                stream = false,
                format = "json",
                options = new { temperature = 0.1 }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/api/chat", jsonContent, ct);

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync(ct);
                using var doc = JsonDocument.Parse(responseString);
                if (doc.RootElement.TryGetProperty("message", out var msgElement) &&
                    msgElement.TryGetProperty("content", out var contentElement))
                {
                    string content = contentElement.GetString() ?? "";
                    var parsed = ParseJsonConstraints(content);
                    if (parsed != null && (parsed.BudgetInRupees > 0 || parsed.Travellers > 0))
                    {
                        // Merge with heuristic fallback for maximum accuracy
                        if (parsed.BudgetInRupees <= 0 && fallback.BudgetInRupees > 0) parsed.BudgetInRupees = fallback.BudgetInRupees;
                        if (string.IsNullOrWhiteSpace(parsed.FromCity) && !string.IsNullOrWhiteSpace(fallback.FromCity)) parsed.FromCity = fallback.FromCity;
                        if (parsed.Travellers <= 0 && fallback.Travellers > 0) parsed.Travellers = fallback.Travellers;
                        if (string.IsNullOrWhiteSpace(parsed.Destination) && !string.IsNullOrWhiteSpace(fallback.Destination)) parsed.Destination = fallback.Destination;
                        if (string.IsNullOrWhiteSpace(parsed.Interests) && !string.IsNullOrWhiteSpace(fallback.Interests)) parsed.Interests = fallback.Interests;
                        return parsed;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Ollama chat call failed or timed out. Gracefully falling back to rule-based constraint parser.");
        }

        return fallback;
    }

    public async Task<string> GenerateExplanationAsync(
        TripConstraints constraints,
        DestinationDto destination,
        HotelDto hotel,
        BudgetBreakdownDto budget,
        WeatherForecastDto weather,
        bool isReplanned = false,
        string? replanReason = null,
        CancellationToken ct = default)
    {
        if (isReplanned && !string.IsNullOrWhiteSpace(replanReason))
        {
            return replanReason;
        }

        try
        {
            var prompt = $"Explain why {destination.Name} and '{hotel.Name}' were chosen for a {constraints.Days}-day trip from {constraints.FromCity} " +
                         $"for {constraints.Travellers} travelers with a budget of ₹{budget.TotalBudget:N0}. " +
                         $"The total estimated cost is ₹{budget.TotalEstimatedCost:N0} ({budget.VerdictSummary}). " +
                         $"Weather is: {weather.DetailedForecast}. " +
                         $"User interests: {constraints.Interests}. Keep the explanation in 2 concise, professional sentences.";

            var requestBody = new
            {
                model = _options.ChatModel,
                messages = new[]
                {
                    new { role = "system", content = "You are a professional travel planning consultant. Reply in 2 concise sentences highlighting why the destination, hotel and budget match the user's criteria." },
                    new { role = "user", content = prompt }
                },
                stream = false,
                options = new { temperature = 0.3 }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/api/chat", jsonContent, ct);

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync(ct);
                using var doc = JsonDocument.Parse(responseString);
                if (doc.RootElement.TryGetProperty("message", out var msgElement) &&
                    msgElement.TryGetProperty("content", out var contentElement))
                {
                    string content = contentElement.GetString() ?? "";
                    if (!string.IsNullOrWhiteSpace(content))
                    {
                        return content.Trim();
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Ollama explanation generation fell back to deterministic template.");
        }

        return $"We selected {destination.Name} because its scenic charm and attractions match your interest in {constraints.Interests}, with favorable weather ({weather.Condition}, {weather.TemperatureCelsius}°C). " +
               $"Staying at '{hotel.Name}' keeps your entire {constraints.Days}-day holiday comfortable while leaving a ₹{budget.RemainingBudget:N0} financial safety buffer.";
    }

    public async Task<List<DayPlanDto>> GenerateItineraryAsync(
        TripConstraints constraints,
        DestinationDto destination,
        HotelDto hotel,
        WeatherForecastDto weather,
        List<ActivityDto> availableActivities,
        CancellationToken ct = default)
    {
        int days = constraints.Days;
        var dayPlans = new List<DayPlanDto>();
        var actList = availableActivities ?? new List<ActivityDto>();

        for (int i = 1; i <= days; i++)
        {
            string dayLabel = GetDayLabel(i, days);
            string morningAct, afternoonAct, eveningAct;

            if (i == 1)
            {
                morningAct = $"Arrival in {destination.Name}, smooth check-in at '{hotel.Name}', unpack and enjoy welcome local refreshments.";
                afternoonAct = actList.ElementAtOrDefault(0)?.Name
                    ?? $"Introductory walking tour through vibrant local streets and scenic highlights of {destination.Name}.";
                eveningAct = actList.ElementAtOrDefault(1)?.Name
                    ?? $"Relaxed sunset stroll along the promenade/ridge followed by dinner near '{hotel.Name}'.";
            }
            else if (i == 2)
            {
                morningAct = actList.ElementAtOrDefault(0)?.Name
                    ?? $"Early morning sightseeing excursion and iconic landmark photography in {destination.Name}.";
                afternoonAct = actList.ElementAtOrDefault(1)?.Name
                    ?? $"Local bazaar exploration, handicrafts shopping, and authentic regional lunch.";
                eveningAct = actList.ElementAtOrDefault(2)?.Name
                    ?? $"Atmospheric evening dinner featuring {destination.Name} signature delicacies.";
            }
            else if (i == 3)
            {
                morningAct = actList.ElementAtOrDefault(2)?.Name
                    ?? $"Invigorating nature walk, viewpoint visit, or peaceful meditation in {destination.Name}.";
                afternoonAct = $"Leisurely afternoon cafe hop, art gallery exploration, and souvenir hunting.";
                eveningAct = $"Candlelight rooftop dinner with scenic panoramic vistas of {destination.Name}.";
            }
            else
            {
                morningAct = $"Unwind with leisurely breakfast at '{hotel.Name}', followed by packing and last-minute photo ops.";
                afternoonAct = "Check-out, final stroll through the central bazaar, and airport/station transfer.";
                eveningAct = $"Safe and comfortable return journey from {destination.Name} with cherished memories.";
            }

            decimal dayCost = (actList.Sum(a => a.CostPerPerson) / Math.Max(1, days)) + 1200;

            dayPlans.Add(new DayPlanDto
            {
                DayNumber = i,
                DayName = dayLabel,
                Morning = morningAct,
                Afternoon = afternoonAct,
                Evening = eveningAct,
                EstimatedDailyCost = Math.Round(dayCost * constraints.Travellers, 0),
                Notes = i == 1
                    ? $"Welcome to {destination.Name}! Weather is expected to be {weather.Condition} ({weather.TemperatureCelsius}°C)."
                    : (i == days ? "Final day: verify all travel documents and departures." : "Full day of curated sightseeing.")
            });
        }

        return dayPlans;
    }

    public async Task<string> GeneratePackingTipAsync(
        string destination,
        WeatherForecastDto weather,
        CancellationToken ct = default)
    {
        if (weather.HasHeavyRain)
        {
            return "Pack high-quality waterproof jackets, a compact windproof umbrella, waterproof shoes, and quick-dry clothing.";
        }
        if (weather.TemperatureCelsius < 18)
        {
            return "Pack warm woolen layers, a fleece jacket, thermal wear for evenings, and comfortable walking boots.";
        }
        if (destination.Contains("beach", StringComparison.OrdinalIgnoreCase) ||
            destination.Equals("Puri", StringComparison.OrdinalIgnoreCase) ||
            destination.Equals("Goa", StringComparison.OrdinalIgnoreCase) ||
            destination.Equals("Pondicherry", StringComparison.OrdinalIgnoreCase))
        {
            return "Pack breathable cottons, UV sunglasses, high-SPF sunscreen, beachwear, flip-flops, and a wide-brim hat.";
        }

        return "Pack comfortable breathable walking clothes, good walking sneakers, sunscreen, and a light jacket for breezy evenings.";
    }

    public async Task<string> GenerateReplanExplanationAsync(
        string originalDestination,
        string newDestination,
        string originalHotel,
        string newHotel,
        decimal originalCost,
        decimal newCost,
        decimal budget,
        string userChangeRequest,
        CancellationToken ct = default)
    {
        decimal savings = originalCost - newCost;
        if (newDestination.Equals(originalDestination, StringComparison.OrdinalIgnoreCase))
        {
            return $"Your original plan exceeded the budget by ₹{(originalCost - budget):N0}, so I selected a lower-cost hotel ('{newHotel}' instead of '{originalHotel}') and adjusted the itinerary, bringing the total to ₹{newCost:N0} (saving ₹{savings:N0}).";
        }

        return $"To meet your budget of ₹{budget:N0}, we adjusted your itinerary from {originalDestination} to {newDestination} with stay at '{newHotel}', reducing total expenses from ₹{originalCost:N0} to ₹{newCost:N0} (saving ₹{savings:N0}).";
    }

    // -------------------------------------------------------------
    // Resilient Fallback Parsers
    // -------------------------------------------------------------
    private static TripConstraints ParseConstraintsFromText(string text)
    {
        var c = new TripConstraints();
        if (string.IsNullOrWhiteSpace(text)) return c;

        // Origin City (e.g. "from Kolkata", "from Delhi")
        var fromMatch = Regex.Match(text, @"from\s+([A-Za-z]+)", RegexOptions.IgnoreCase);
        if (fromMatch.Success) c.FromCity = fromMatch.Groups[1].Value;

        // Destination (e.g. "Goa trip", "Darjeeling", "Puri", "Jaipur", "Rishikesh", "Coorg", "Pondicherry")
        string[] commonDests = { "Darjeeling", "Puri", "Goa", "Rishikesh", "Jaipur", "Coorg", "Pondicherry", "Munnar", "Udaipur", "Manali" };
        foreach (var dest in commonDests)
        {
            if (Regex.IsMatch(text, $@"\b{dest}\b", RegexOptions.IgnoreCase))
            {
                c.Destination = dest;
                break;
            }
        }

        // Budget (e.g. "under ₹30,000", "budget 30000", "₹25000", "Rs 25,000", "30k")
        var budgetMatch = Regex.Match(text, @"(?:budget|under|below|within|rs\.?|₹)\s*(\d[\d,]*)(?:k)?", RegexOptions.IgnoreCase);
        if (budgetMatch.Success)
        {
            string cleanNum = budgetMatch.Groups[1].Value.Replace(",", "");
            if (decimal.TryParse(cleanNum, out decimal val))
            {
                if (text.ToLower().Contains(cleanNum + "k")) val *= 1000;
                c.BudgetInRupees = val;
            }
        }
        else
        {
            var rawNumMatch = Regex.Match(text, @"\b(\d{4,6})\b");
            if (rawNumMatch.Success && decimal.TryParse(rawNumMatch.Groups[1].Value, out decimal rawVal))
            {
                c.BudgetInRupees = rawVal;
            }
        }

        // Days / Nights (e.g. "4 day trip", "2 nights", "3 days")
        var daysMatch = Regex.Match(text, @"(\d+)\s*(?:day|days)", RegexOptions.IgnoreCase);
        if (daysMatch.Success && int.TryParse(daysMatch.Groups[1].Value, out int d))
        {
            c.Nights = Math.Max(1, d - 1);
        }
        else
        {
            var nightsMatch = Regex.Match(text, @"(\d+)\s*(?:night|nights)", RegexOptions.IgnoreCase);
            if (nightsMatch.Success && int.TryParse(nightsMatch.Groups[1].Value, out int n))
            {
                c.Nights = n;
            }
        }

        // Travellers (e.g. "2 people", "for 3 travellers", "couple", "solo")
        var peopleMatch = Regex.Match(text, @"(\d+)\s*(?:people|persons|travellers|travelers|friends|adults)", RegexOptions.IgnoreCase);
        if (peopleMatch.Success && int.TryParse(peopleMatch.Groups[1].Value, out int p))
        {
            c.Travellers = p;
        }
        else if (Regex.IsMatch(text, @"\b(?:couple|for\s+2)\b", RegexOptions.IgnoreCase))
        {
            c.Travellers = 2;
        }
        else if (Regex.IsMatch(text, @"\b(?:solo|alone)\b", RegexOptions.IgnoreCase))
        {
            c.Travellers = 1;
        }

        // Interests (e.g. beach, hills, food, tea, adventure)
        var interests = new List<string>();
        string[] candidateInterests = { "beach", "hills", "tea", "food", "adventure", "heritage", "spiritual", "rafting", "nature" };
        foreach (var item in candidateInterests)
        {
            if (Regex.IsMatch(text, $@"\b{item}\b", RegexOptions.IgnoreCase))
            {
                interests.Add(item);
            }
        }
        if (interests.Any()) c.Interests = string.Join(", ", interests);

        // Weather preference
        if (Regex.IsMatch(text, @"(?:no\s+heavy\s+rain|avoid\s+rain|without\s+rain)", RegexOptions.IgnoreCase))
        {
            c.WeatherPreference = "Avoid heavy rain";
        }

        return c;
    }

    private static TripConstraints? ParseJsonConstraints(string json)
    {
        try
        {
            string clean = json.Trim();
            if (clean.StartsWith("```json")) clean = clean[7..];
            if (clean.StartsWith("```")) clean = clean[3..];
            if (clean.EndsWith("```")) clean = clean[..^3];
            clean = clean.Trim();

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<TripConstraints>(clean, options);
        }
        catch
        {
            return null;
        }
    }

    private static string GetDayLabel(int dayNumber, int totalDays)
    {
        return dayNumber switch
        {
            1 => "Day 1 - Arrival & Orientation",
            2 => totalDays == 2 ? "Day 2 - Highlights & Departure" : "Day 2 - Core Sightseeing & Adventure",
            3 => totalDays == 3 ? "Day 3 - Heritage & Farewell" : "Day 3 - Nature & Cultural Exploration",
            4 => "Day 4 - Leisure & Departure",
            _ => $"Day {dayNumber} - Exploration"
        };
    }
}
