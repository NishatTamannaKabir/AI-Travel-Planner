using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.Interfaces;
using Microsoft.Extensions.AI;

namespace AITravelPlanner.Application.Tools;

/// <summary>
/// AI Tool declarations for Microsoft Agent Framework & Microsoft.Extensions.AI.
/// Exposes domain functions as callable agent tools with detailed XML descriptions.
/// </summary>
public class TravelTools
{
    private readonly IDestinationRepository _destinationRepo;
    private readonly IHotelRepository _hotelRepo;
    private readonly IWeatherService _weatherService;
    private readonly IBudgetService _budgetService;

    public TravelTools(
        IDestinationRepository destinationRepo,
        IHotelRepository hotelRepo,
        IWeatherService weatherService,
        IBudgetService budgetService)
    {
        _destinationRepo = destinationRepo;
        _hotelRepo = hotelRepo;
        _weatherService = weatherService;
        _budgetService = budgetService;
    }

    [Description("Finds destinations matching user interests (e.g. beach, hills, tea, heritage, adventure, food) with travel costs.")]
    public async Task<string> SearchDestinationsAsync(
        [Description("Interest keyword, e.g. beach, hills, nature, heritage, adventure, food")] string interest,
        CancellationToken ct = default)
    {
        var destinations = await _destinationRepo.SearchByInterestsAsync(interest, ct);
        if (!destinations.Any())
        {
            var all = await _destinationRepo.GetAllAsync(ct);
            destinations = all.Take(4).ToList();
        }

        var sb = new StringBuilder();
        foreach (var d in destinations)
        {
            sb.AppendLine($"{d.Name} (State: {d.State}) - Tags: {d.Tags} - Travel Cost: ₹{d.TravelCostPerPerson:N0} per person round-trip");
        }
        return sb.ToString();
    }

    [Description("Gets the weather forecast for a destination to ensure favorable conditions.")]
    public async Task<string> GetWeatherForecastAsync(
        [Description("Destination name, e.g. Puri, Darjeeling, Goa, Rishikesh, Jaipur")] string destination,
        CancellationToken ct = default)
    {
        var forecast = await _weatherService.GetWeatherForecastAsync(destination, ct);
        return $"{forecast.Destination}: {forecast.DetailedForecast} (Heavy rain: {(forecast.HasHeavyRain ? "YES" : "NO")})";
    }

    [Description("Searches for hotels in a specific destination within an optional maximum nightly price.")]
    public async Task<string> SearchHotelsAsync(
        [Description("Destination name, e.g. Puri, Darjeeling, Goa")] string destination,
        [Description("Maximum budget per night in INR")] decimal maxPricePerNight = 10000,
        CancellationToken ct = default)
    {
        var hotels = await _hotelRepo.GetByDestinationAsync(destination, maxPricePerNight, ct);
        if (!hotels.Any())
        {
            return $"No hotels found in {destination} under ₹{maxPricePerNight:N0} per night.";
        }

        var sb = new StringBuilder();
        foreach (var h in hotels.OrderBy(h => h.PricePerNight))
        {
            sb.AppendLine($"{h.Name} - ₹{h.PricePerNight:N0}/night - Rating: {h.Rating:F1}★ - Amenities: {h.Amenities}");
        }
        return sb.ToString();
    }

    [Description("Calculates comprehensive travel budget breakdown and returns feasibility verdict.")]
    public string CalculateBudget(
        [Description("Round-trip travel cost per person")] decimal travelCostPerPerson,
        [Description("Hotel price per night")] decimal hotelPricePerNight,
        [Description("Number of nights stay")] int nights,
        [Description("Number of travellers")] int travellers,
        [Description("User total budget in INR")] decimal totalBudget,
        [Description("Estimated activities cost per person")] decimal activitiesCostPerPerson = 1000)
    {
        var result = _budgetService.CalculateBudget(
            travelCostPerPerson,
            hotelPricePerNight,
            nights,
            travellers,
            totalBudget,
            activitiesCostPerPerson);

        return $"Travel: ₹{result.TravelCost:N0}, Hotel: ₹{result.HotelCost:N0}, Food: ₹{result.FoodCost:N0}, " +
               $"Activities: ₹{result.ActivitiesCost:N0}, Buffer: ₹{result.MiscCost:N0} | " +
               $"TOTAL: ₹{result.TotalEstimatedCost:N0} -> {result.VerdictSummary}";
    }

    /// <summary>
    /// Returns Microsoft.Extensions.AI / Microsoft Agent Framework tool definitions
    /// </summary>
    public IList<AITool> GetAITools()
    {
        return new List<AITool>
        {
            AIFunctionFactory.Create(SearchDestinationsAsync),
            AIFunctionFactory.Create(GetWeatherForecastAsync),
            AIFunctionFactory.Create(SearchHotelsAsync),
            AIFunctionFactory.Create(CalculateBudget)
        };
    }
}
