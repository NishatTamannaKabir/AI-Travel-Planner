using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace AITravelPlanner.Application.Services;

public class TravelPlanningService : ITravelPlanningService
{
    private readonly IDestinationRepository _destinationRepo;
    private readonly IHotelRepository _hotelRepo;
    private readonly IWeatherService _weatherService;
    private readonly IBudgetService _budgetService;
    private readonly IAIService _aiService;
    private readonly IReplanningService _replanningService;
    private readonly ITripRepository _tripRepo;
    private readonly ILogger<TravelPlanningService> _logger;

    public TravelPlanningService(
        IDestinationRepository destinationRepo,
        IHotelRepository hotelRepo,
        IWeatherService weatherService,
        IBudgetService budgetService,
        IAIService aiService,
        IReplanningService replanningService,
        ITripRepository tripRepo,
        ILogger<TravelPlanningService> logger)
    {
        _destinationRepo = destinationRepo;
        _hotelRepo = hotelRepo;
        _weatherService = weatherService;
        _budgetService = budgetService;
        _aiService = aiService;
        _replanningService = replanningService;
        _tripRepo = tripRepo;
        _logger = logger;
    }

    public async Task<TripPlanResponse> PlanTripAsync(PlanTripRequest request, int? userId = null, CancellationToken ct = default)
    {
        _logger.LogInformation("Starting trip planning. Natural language prompt: '{Prompt}'", request.Prompt);

        // 1. Understand & Extract Constraints
        TripConstraints constraints;
        if (!string.IsNullOrWhiteSpace(request.Prompt))
        {
            constraints = await _aiService.ExtractConstraintsAsync(request.Prompt, ct);
        }
        else
        {
            constraints = new TripConstraints();
        }

        // Apply explicit user inputs over AI extracted fields if provided
        if (!string.IsNullOrWhiteSpace(request.FromCity)) constraints.FromCity = request.FromCity;
        if (!string.IsNullOrWhiteSpace(request.Destination)) constraints.Destination = request.Destination;
        if (request.BudgetInRupees.HasValue && request.BudgetInRupees.Value > 0) constraints.BudgetInRupees = request.BudgetInRupees.Value;
        if (request.Travellers.HasValue && request.Travellers.Value > 0) constraints.Travellers = request.Travellers.Value;
        if (request.Days.HasValue && request.Days.Value > 0) constraints.Nights = Math.Max(1, request.Days.Value - 1);
        if (!string.IsNullOrWhiteSpace(request.Interests)) constraints.Interests = request.Interests;
        if (!string.IsNullOrWhiteSpace(request.WeatherPreference)) constraints.WeatherPreference = request.WeatherPreference;
        if (!string.IsNullOrWhiteSpace(request.Notes)) constraints.Notes = request.Notes;

        // Sensible fallbacks
        if (string.IsNullOrWhiteSpace(constraints.FromCity)) constraints.FromCity = "Kolkata";
        if (constraints.Travellers <= 0) constraints.Travellers = 2;
        if (constraints.Nights <= 0) constraints.Nights = 2;
        if (constraints.BudgetInRupees <= 0) constraints.BudgetInRupees = 30000;
        if (string.IsNullOrWhiteSpace(constraints.Interests)) constraints.Interests = "beach, relaxation, food";

        // 2. Destination Search & Matching
        var allDestinations = await _destinationRepo.GetAllAsync(ct);
        Destination? selectedDestination = null;

        if (!string.IsNullOrWhiteSpace(constraints.Destination))
        {
            selectedDestination = allDestinations.FirstOrDefault(d =>
                d.Name.Equals(constraints.Destination.Trim(), StringComparison.OrdinalIgnoreCase) ||
                constraints.Destination.Contains(d.Name, StringComparison.OrdinalIgnoreCase));
        }

        if (selectedDestination == null)
        {
            // Match against interests
            var candidateDestinations = allDestinations
                .Where(d => constraints.Interests.Split(',', ';', ' ')
                    .Any(tag => !string.IsNullOrWhiteSpace(tag) && d.Tags.Contains(tag.Trim(), StringComparison.OrdinalIgnoreCase)))
                .ToList();

            if (!candidateDestinations.Any())
            {
                candidateDestinations = allDestinations;
            }

            // Rank by weather & budget
            var weatherDict = await _weatherService.GetDestinationsWeatherAsync(candidateDestinations.Select(d => d.Name), ct);
            var filteredByWeather = candidateDestinations
                .Where(d => !weatherDict.TryGetValue(d.Name, out var w) || !w.HasHeavyRain)
                .ToList();

            selectedDestination = filteredByWeather.FirstOrDefault() ?? candidateDestinations.First();
        }

        var destinationDto = MapDestinationToDto(selectedDestination);
        var weather = await _weatherService.GetWeatherForecastAsync(selectedDestination.Name, ct);

        // 3. Hotel Selection
        var hotels = await _hotelRepo.GetByDestinationAsync(selectedDestination.Name, null, ct);
        if (!hotels.Any())
        {
            hotels.Add(new Hotel
            {
                Name = $"{selectedDestination.Name} Grand Residency",
                PricePerNight = 2500,
                Rating = 4.2,
                Amenities = "Free Wi-Fi, Breakfast, AC"
            });
        }

        // Recommend best hotel matching budget
        decimal maxIdealNightly = _budgetService.SuggestMaxHotelRate(
            constraints.BudgetInRupees,
            selectedDestination.TravelCostPerPerson,
            constraints.Nights,
            constraints.Travellers);

        var matchingHotels = hotels.Where(h => h.PricePerNight <= maxIdealNightly).OrderByDescending(h => h.Rating).ToList();
        var selectedHotel = matchingHotels.FirstOrDefault() ?? hotels.OrderBy(h => h.PricePerNight).First();
        var hotelDto = MapHotelToDto(selectedHotel, selectedDestination.Name);

        // 4. Budget Calculation
        var budget = _budgetService.CalculateBudget(
            selectedDestination.TravelCostPerPerson,
            selectedHotel.PricePerNight,
            constraints.Nights,
            constraints.Travellers,
            constraints.BudgetInRupees,
            activitiesCostPerPerson: 1000);

        bool isReplanned = false;
        string? replanNotes = null;
        var warnings = new List<string>();

        // 5. Automatic Budget Recovery (The core differentiating feature!)
        if (!budget.WithinBudget)
        {
            _logger.LogWarning("Selected plan exceeds budget by ₹{Over:N0}. Attempting automatic budget replanning.", budget.OverBudgetBy);
            var recoveredPlan = await _replanningService.AttemptAutomaticBudgetRecoveryAsync(
                constraints,
                destinationDto,
                hotelDto,
                budget,
                weather,
                ct);

            if (recoveredPlan != null)
            {
                destinationDto = recoveredPlan.Destination;
                hotelDto = recoveredPlan.ChosenHotel;
                budget = recoveredPlan.Budget;
                weather = recoveredPlan.Weather;
                isReplanned = true;
                replanNotes = recoveredPlan.ReplanNotes;
            }
            else
            {
                warnings.Add($"Total estimated cost exceeds your budget by ₹{budget.OverBudgetBy:N0}. Consider increasing your budget or shortening the trip duration.");
            }
        }

        // 6. Generate Itinerary & Packing Tips
        var daysPlan = await _aiService.GenerateItineraryAsync(constraints, destinationDto, hotelDto, weather, destinationDto.Activities, ct);
        var explanation = await _aiService.GenerateExplanationAsync(constraints, destinationDto, hotelDto, budget, weather, isReplanned, replanNotes, ct);
        var packingTip = await _aiService.GeneratePackingTipAsync(destinationDto.Name, weather, ct);

        // 7. Persist to Database
        var tripEntity = new Trip
        {
            UserId = userId,
            Title = $"Trip to {destinationDto.Name} ({constraints.Days} Days)",
            OriginCity = constraints.FromCity,
            DestinationName = destinationDto.Name,
            DestinationId = destinationDto.Id > 0 ? destinationDto.Id : null,
            TotalBudget = constraints.BudgetInRupees,
            EstimatedTotalCost = budget.TotalEstimatedCost,
            RemainingBudget = budget.RemainingBudget,
            Travellers = constraints.Travellers,
            Nights = constraints.Nights,
            Days = constraints.Days,
            Status = isReplanned ? TripStatus.Replanned : TripStatus.Planned,
            Interests = constraints.Interests,
            WeatherSummary = weather.DetailedForecast,
            ChosenHotelName = hotelDto.Name,
            ChosenHotelPricePerNight = hotelDto.PricePerNight,
            TravelCost = budget.TravelCost,
            HotelCost = budget.HotelCost,
            FoodCost = budget.FoodCost,
            ActivitiesCost = budget.ActivitiesCost,
            MiscCost = budget.MiscCost,
            AiExplanation = explanation,
            PackingTip = packingTip,
            ReplanNotes = replanNotes,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var dp in daysPlan)
        {
            tripEntity.ItineraryDays.Add(new ItineraryDay
            {
                DayNumber = dp.DayNumber,
                DayName = dp.DayName,
                MorningActivity = dp.Morning,
                AfternoonActivity = dp.Afternoon,
                EveningActivity = dp.Evening,
                EstimatedDailyCost = dp.EstimatedDailyCost,
                Notes = dp.Notes
            });
        }

        await _tripRepo.AddAsync(tripEntity, ct);

        return new TripPlanResponse
        {
            TripId = tripEntity.Id,
            Title = tripEntity.Title,
            OriginCity = tripEntity.OriginCity,
            Destination = destinationDto,
            ChosenHotel = hotelDto,
            Weather = weather,
            Travellers = constraints.Travellers,
            Nights = constraints.Nights,
            Days = constraints.Days,
            Budget = budget,
            AiExplanation = explanation,
            PackingTip = packingTip,
            IsReplanned = isReplanned,
            ReplanNotes = replanNotes,
            Warnings = warnings,
            DaysPlan = daysPlan,
            CreatedAt = tripEntity.CreatedAt,
            IsSaved = false
        };
    }

    public async Task<TripPlanResponse> ReplanTripAsync(ReplanTripRequest request, int? userId = null, CancellationToken ct = default)
    {
        return await _replanningService.ReplanAsync(request, userId, ct);
    }

    public async Task<TripPlanResponse> SaveTripAsync(int tripId, int userId, CancellationToken ct = default)
    {
        var trip = await _tripRepo.GetByIdWithDetailsAsync(tripId, ct);
        if (trip == null)
        {
            throw new KeyNotFoundException($"Trip with ID {tripId} not found.");
        }

        if (trip.UserId.HasValue && trip.UserId.Value != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to modify or save this trip.");
        }

        trip.UserId = userId;
        trip.Status = TripStatus.Confirmed;
        trip.UpdatedAt = DateTime.UtcNow;

        var existingSaved = await _tripRepo.GetSavedPlanAsync(tripId, userId, ct);
        if (existingSaved == null)
        {
            var savedPlan = new SavedPlan
            {
                UserId = userId,
                TripId = tripId,
                PlanTitle = trip.Title,
                Notes = trip.ReplanNotes ?? "Saved itinerary",
                SavedAt = DateTime.UtcNow,
                PlanJson = JsonSerializer.Serialize(new
                {
                    trip.Id,
                    trip.Title,
                    trip.OriginCity,
                    trip.DestinationName,
                    trip.TotalBudget,
                    trip.EstimatedTotalCost,
                    trip.Days,
                    trip.Nights,
                    trip.Travellers,
                    trip.ChosenHotelName
                })
            };
            await _tripRepo.SavePlanAsync(savedPlan, ct);
        }

        await _tripRepo.UpdateAsync(trip, ct);
        return (await GetTripByIdAsync(tripId, userId, ct))!;
    }

    public async Task<List<TripSummaryDto>> GetUserTripsAsync(int userId, CancellationToken ct = default)
    {
        var trips = await _tripRepo.GetByUserIdAsync(userId, ct);
        return trips.Select(t => new TripSummaryDto
        {
            Id = t.Id,
            Title = t.Title,
            DestinationName = t.DestinationName,
            OriginCity = t.OriginCity,
            TotalBudget = t.TotalBudget,
            EstimatedTotalCost = t.EstimatedTotalCost,
            WithinBudget = t.WithinBudget,
            Travellers = t.Travellers,
            Days = t.Days,
            Nights = t.Nights,
            Status = t.Status.ToString(),
            CreatedAt = t.CreatedAt,
            HotelName = t.ChosenHotelName,
            WeatherSummary = t.WeatherSummary
        }).ToList();
    }

    public async Task<TripPlanResponse?> GetTripByIdAsync(int tripId, int? userId = null, CancellationToken ct = default)
    {
        var trip = await _tripRepo.GetByIdWithDetailsAsync(tripId, ct);
        if (trip == null) return null;

        var dest = trip.Destination ?? await _destinationRepo.GetByNameAsync(trip.DestinationName, ct);
        var destDto = dest != null ? MapDestinationToDto(dest) : new DestinationDto { Name = trip.DestinationName };
        var hotelDto = new HotelDto
        {
            Name = trip.ChosenHotelName,
            PricePerNight = trip.ChosenHotelPricePerNight,
            DestinationName = trip.DestinationName
        };

        var weather = await _weatherService.GetWeatherForecastAsync(trip.DestinationName, ct);

        var budget = new BudgetBreakdownDto
        {
            TravelCost = trip.TravelCost,
            HotelCost = trip.HotelCost,
            FoodCost = trip.FoodCost,
            ActivitiesCost = trip.ActivitiesCost,
            MiscCost = trip.MiscCost,
            TotalEstimatedCost = trip.EstimatedTotalCost,
            TotalBudget = trip.TotalBudget,
            RemainingBudget = trip.RemainingBudget,
            CostPerTraveller = trip.Travellers > 0 ? Math.Round(trip.EstimatedTotalCost / trip.Travellers, 2) : trip.EstimatedTotalCost,
            VerdictSummary = trip.WithinBudget ? $"WITHIN budget (₹{trip.RemainingBudget:N0} remaining buffer)" : $"OVER budget by ₹{Math.Abs(trip.RemainingBudget):N0}"
        };

        return new TripPlanResponse
        {
            TripId = trip.Id,
            Title = trip.Title,
            OriginCity = trip.OriginCity,
            Destination = destDto,
            ChosenHotel = hotelDto,
            Weather = weather,
            Travellers = trip.Travellers,
            Nights = trip.Nights,
            Days = trip.Days,
            Budget = budget,
            AiExplanation = trip.AiExplanation,
            PackingTip = trip.PackingTip,
            IsReplanned = trip.Status == TripStatus.Replanned,
            ReplanNotes = trip.ReplanNotes,
            DaysPlan = trip.ItineraryDays.OrderBy(d => d.DayNumber).Select(d => new DayPlanDto
            {
                DayNumber = d.DayNumber,
                DayName = d.DayName,
                Morning = d.MorningActivity,
                Afternoon = d.AfternoonActivity,
                Evening = d.EveningActivity,
                EstimatedDailyCost = d.EstimatedDailyCost,
                Notes = d.Notes
            }).ToList(),
            CreatedAt = trip.CreatedAt,
            IsSaved = trip.Status == TripStatus.Confirmed || (userId.HasValue && trip.SavedPlans.Any(s => s.UserId == userId.Value))
        };
    }

    public async Task<bool> DeleteTripAsync(int tripId, int userId, CancellationToken ct = default)
    {
        var trip = await _tripRepo.GetByIdAsync(tripId, ct);
        if (trip == null || (trip.UserId.HasValue && trip.UserId.Value != userId))
        {
            return false;
        }

        await _tripRepo.DeleteAsync(trip, ct);
        return true;
    }

    private static DestinationDto MapDestinationToDto(Destination d)
    {
        return new DestinationDto
        {
            Id = d.Id,
            Name = d.Name,
            State = d.State,
            Description = d.Description,
            Tags = d.Tags,
            TravelCostPerPerson = d.TravelCostPerPerson,
            IdealDurationDays = d.IdealDurationDays,
            BestSeason = d.BestSeason,
            ImageUrl = d.ImageUrl,
            Hotels = d.Hotels?.Select(h => MapHotelToDto(h, d.Name)).ToList() ?? new(),
            Activities = d.Activities?.Select(a => new ActivityDto
            {
                Id = a.Id,
                DestinationId = a.DestinationId,
                DestinationName = d.Name,
                Name = a.Name,
                Description = a.Description,
                CostPerPerson = a.CostPerPerson,
                TimeOfDay = a.TimeOfDay.ToString(),
                Category = a.Category
            }).ToList() ?? new()
        };
    }

    private static HotelDto MapHotelToDto(Hotel h, string destName)
    {
        return new HotelDto
        {
            Id = h.Id,
            DestinationId = h.DestinationId,
            DestinationName = destName,
            Name = h.Name,
            Description = h.Description,
            PricePerNight = h.PricePerNight,
            Rating = h.Rating,
            Amenities = h.Amenities,
            Address = h.Address,
            ImageUrl = h.ImageUrl
        };
    }
}
