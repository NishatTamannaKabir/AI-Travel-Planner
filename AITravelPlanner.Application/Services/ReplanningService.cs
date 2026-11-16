using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace AITravelPlanner.Application.Services;

public class ReplanningService : IReplanningService
{
    private readonly IDestinationRepository _destinationRepo;
    private readonly IHotelRepository _hotelRepo;
    private readonly IWeatherService _weatherService;
    private readonly IBudgetService _budgetService;
    private readonly IAIService _aiService;
    private readonly ITripRepository _tripRepo;
    private readonly ILogger<ReplanningService> _logger;

    public ReplanningService(
        IDestinationRepository destinationRepo,
        IHotelRepository hotelRepo,
        IWeatherService weatherService,
        IBudgetService budgetService,
        IAIService aiService,
        ITripRepository tripRepo,
        ILogger<ReplanningService> logger)
    {
        _destinationRepo = destinationRepo;
        _hotelRepo = hotelRepo;
        _weatherService = weatherService;
        _budgetService = budgetService;
        _aiService = aiService;
        _tripRepo = tripRepo;
        _logger = logger;
    }

    /// <summary>
    /// Automatic recovery when initial plan exceeds the user budget.
    /// Hierarchy of intelligent fallback:
    /// 1. Try cheaper hotel in the same destination
    /// 2. If still over budget, find alternative matching destination with lower travel cost
    /// 3. If still over budget, optimize activity & dining allowance
    /// </summary>
    public async Task<TripPlanResponse?> AttemptAutomaticBudgetRecoveryAsync(
        TripConstraints constraints,
        DestinationDto currentDestination,
        HotelDto currentHotel,
        BudgetBreakdownDto initialBudget,
        WeatherForecastDto currentWeather,
        CancellationToken ct = default)
    {
        _logger.LogInformation("Plan exceeded budget by ₹{Deficit:N0}. Starting AI Budget Recovery Engine.", initialBudget.OverBudgetBy);

        decimal deficit = initialBudget.OverBudgetBy;
        var destinationHotels = await _hotelRepo.GetByDestinationAsync(currentDestination.Name, null, ct);

        // Step 1: Look for a cheaper hotel in the same destination
        var cheaperHotels = destinationHotels
            .Where(h => h.Id != currentHotel.Id && h.PricePerNight < currentHotel.PricePerNight)
            .OrderBy(h => h.PricePerNight)
            .ToList();

        foreach (var candidateHotel in cheaperHotels)
        {
            var testBudget = _budgetService.CalculateBudget(
                currentDestination.TravelCostPerPerson,
                candidateHotel.PricePerNight,
                constraints.Nights,
                constraints.Travellers,
                constraints.BudgetInRupees,
                activitiesCostPerPerson: 1000);

            if (testBudget.WithinBudget)
            {
                var candidateHotelDto = MapHotelToDto(candidateHotel, currentDestination.Name);
                string explanation = await _aiService.GenerateReplanExplanationAsync(
                    currentDestination.Name,
                    currentDestination.Name,
                    currentHotel.Name,
                    candidateHotel.Name,
                    initialBudget.TotalEstimatedCost,
                    testBudget.TotalEstimatedCost,
                    constraints.BudgetInRupees,
                    "Automatic budget recovery: replaced premium hotel with a budget-friendly alternative.",
                    ct);

                var activities = currentDestination.Activities;
                var daysPlan = await _aiService.GenerateItineraryAsync(constraints, currentDestination, candidateHotelDto, currentWeather, activities, ct);
                var packingTip = await _aiService.GeneratePackingTipAsync(currentDestination.Name, currentWeather, ct);

                return new TripPlanResponse
                {
                    Title = $"Trip to {currentDestination.Name} (Optimized for Budget)",
                    OriginCity = constraints.FromCity,
                    Destination = currentDestination,
                    ChosenHotel = candidateHotelDto,
                    Weather = currentWeather,
                    Travellers = constraints.Travellers,
                    Nights = constraints.Nights,
                    Days = constraints.Days,
                    Budget = testBudget,
                    AiExplanation = explanation,
                    IsReplanned = true,
                    ReplanNotes = $"Your original plan exceeded the budget by ₹{deficit:N0}. We automatically switched your stay from '{currentHotel.Name}' (₹{currentHotel.PricePerNight:N0}/night) to '{candidateHotel.Name}' (₹{candidateHotel.PricePerNight:N0}/night), bringing the total safely within budget.",
                    DaysPlan = daysPlan,
                    PackingTip = packingTip,
                    CreatedAt = DateTime.UtcNow
                };
            }
        }

        // Step 2: Try alternative destinations matching interests with lower travel cost
        var allDestinations = await _destinationRepo.GetAllAsync(ct);
        var altDestinations = allDestinations
            .Where(d => d.Id != currentDestination.Id && d.TravelCostPerPerson < currentDestination.TravelCostPerPerson)
            .OrderBy(d => d.TravelCostPerPerson)
            .ToList();

        foreach (var altDest in altDestinations)
        {
            var altWeather = await _weatherService.GetWeatherForecastAsync(altDest.Name, ct);
            if (constraints.WeatherPreference.Contains("Avoid heavy rain", StringComparison.OrdinalIgnoreCase) && altWeather.HasHeavyRain)
            {
                continue;
            }

            var altHotels = await _hotelRepo.GetByDestinationAsync(altDest.Name, null, ct);
            if (!altHotels.Any()) continue;

            var bestAltHotel = altHotels.OrderBy(h => h.PricePerNight).First();
            var testBudget = _budgetService.CalculateBudget(
                altDest.TravelCostPerPerson,
                bestAltHotel.PricePerNight,
                constraints.Nights,
                constraints.Travellers,
                constraints.BudgetInRupees,
                activitiesCostPerPerson: 800);

            if (testBudget.WithinBudget)
            {
                var altDestDto = MapDestinationToDto(altDest);
                var altHotelDto = MapHotelToDto(bestAltHotel, altDest.Name);

                string explanation = await _aiService.GenerateReplanExplanationAsync(
                    currentDestination.Name,
                    altDest.Name,
                    currentHotel.Name,
                    bestAltHotel.Name,
                    initialBudget.TotalEstimatedCost,
                    testBudget.TotalEstimatedCost,
                    constraints.BudgetInRupees,
                    $"Destination re-routed from {currentDestination.Name} to {altDest.Name} to fit budget constraints.",
                    ct);

                var daysPlan = await _aiService.GenerateItineraryAsync(constraints, altDestDto, altHotelDto, altWeather, altDestDto.Activities, ct);
                var packingTip = await _aiService.GeneratePackingTipAsync(altDest.Name, altWeather, ct);

                return new TripPlanResponse
                {
                    Title = $"Trip to {altDest.Name} (Budget Recovery Replan)",
                    OriginCity = constraints.FromCity,
                    Destination = altDestDto,
                    ChosenHotel = altHotelDto,
                    Weather = altWeather,
                    Travellers = constraints.Travellers,
                    Nights = constraints.Nights,
                    Days = constraints.Days,
                    Budget = testBudget,
                    AiExplanation = explanation,
                    IsReplanned = true,
                    ReplanNotes = $"Your original plan to {currentDestination.Name} exceeded your budget by ₹{deficit:N0}. We replanned your vacation to {altDest.Name} with '{bestAltHotel.Name}', saving ₹{(initialBudget.TotalEstimatedCost - testBudget.TotalEstimatedCost):N0}.",
                    DaysPlan = daysPlan,
                    PackingTip = packingTip,
                    CreatedAt = DateTime.UtcNow
                };
            }
        }

        // Return null if even lowest options cannot fit (caller will return with warnings)
        return null;
    }

    /// <summary>
    /// Replans an existing saved or planned trip based on user prompt ("make it cheaper", "switch destination", etc.)
    /// </summary>
    public async Task<TripPlanResponse> ReplanAsync(ReplanTripRequest request, int? userId = null, CancellationToken ct = default)
    {
        var trip = await _tripRepo.GetByIdWithDetailsAsync(request.TripId, ct);
        if (trip == null)
        {
            throw new KeyNotFoundException($"Trip with ID {request.TripId} not found.");
        }

        // Validate NewTargetBudget if provided
        if (request.NewTargetBudget.HasValue)
        {
            decimal budgetVal = request.NewTargetBudget.Value;

            if (budgetVal <= 0)
            {
                throw new ArgumentException("Target budget must be a positive whole number greater than 0.");
            }

            if (budgetVal > 10000000m)
            {
                throw new ArgumentException("Target budget cannot exceed ₹1,00,00,000 (₹1 crore).");
            }

            if (budgetVal != Math.Floor(budgetVal))
            {
                throw new ArgumentException("Target budget must be a whole number (no decimals).");
            }
        }

        decimal targetBudget = request.NewTargetBudget ?? trip.TotalBudget;
        string userPrompt = request.UserChangeRequest.Trim();
        bool userWantsCheaper = userPrompt.Contains("cheap", StringComparison.OrdinalIgnoreCase) ||
                                userPrompt.Contains("budget", StringComparison.OrdinalIgnoreCase) ||
                                userPrompt.Contains("reduce", StringComparison.OrdinalIgnoreCase) ||
                                userPrompt.Contains("lower", StringComparison.OrdinalIgnoreCase) ||
                                (request.NewTargetBudget.HasValue && request.NewTargetBudget.Value < trip.EstimatedTotalCost);

        // Determine destination
        Destination destinationEntity = null!;
        if (!string.IsNullOrWhiteSpace(request.PreferredDestination))
        {
            var dest = await _destinationRepo.GetByNameAsync(request.PreferredDestination, ct);
            if (dest != null) destinationEntity = dest;
        }

        if (destinationEntity == null)
        {
            // Check if user prompt mentions a specific destination
            var allDests = (await _destinationRepo.GetAllAsync(ct)) ?? new List<Destination>();
            var mentionedDest = allDests.FirstOrDefault(d =>
                !string.IsNullOrWhiteSpace(d.Name) && userPrompt.Contains(d.Name, StringComparison.OrdinalIgnoreCase));

            if (mentionedDest != null)
            {
                destinationEntity = mentionedDest;
            }
            else
            {
                destinationEntity = trip.Destination
                    ?? (await _destinationRepo.GetByNameAsync(trip.DestinationName, ct))
                    ?? allDests.FirstOrDefault()
                    ?? new Destination { Name = trip.DestinationName };
            }
        }

        // Validate trip feasibility against minimum realistic cost for this destination
        var hotelsInDest = await _hotelRepo.GetByDestinationAsync(destinationEntity.Name, null, ct);
        decimal minHotelRate = hotelsInDest != null && hotelsInDest.Any()
            ? hotelsInDest.Min(h => h.PricePerNight)
            : (trip.ChosenHotelPricePerNight > 0 ? Math.Min(trip.ChosenHotelPricePerNight, 1200m) : 1000m);

        decimal minFeasibleCost = _budgetService.CalculateMinimumFeasibleCost(
            destinationEntity.TravelCostPerPerson,
            minHotelRate,
            trip.Nights,
            trip.Travellers);

        if (request.NewTargetBudget.HasValue && request.NewTargetBudget.Value < minFeasibleCost)
        {
            throw new ArgumentException(
                $"Target budget of ₹{request.NewTargetBudget.Value:N0} is too low for this trip. The minimum feasible budget for {destinationEntity.Name} ({trip.Travellers} {(trip.Travellers == 1 ? "traveler" : "travelers")}, {trip.Days} days) is approximately ₹{minFeasibleCost:N0}.");
        }

        var destinationDto = MapDestinationToDto(destinationEntity);
        var weather = await _weatherService.GetWeatherForecastAsync(destinationEntity.Name, ct);

        // Find candidate hotel
        var hotels = await _hotelRepo.GetByDestinationAsync(destinationEntity.Name, null, ct);
        Hotel selectedHotel;

        if (userWantsCheaper)
        {
            // Pick lowest cost hotel
            selectedHotel = hotels.OrderBy(h => h.PricePerNight).FirstOrDefault() ?? new Hotel { Name = "Economy Guest House", PricePerNight = 1200, Rating = 3.8 };
        }
        else if (request.MaxHotelPricePerNight.HasValue)
        {
            selectedHotel = hotels.Where(h => h.PricePerNight <= request.MaxHotelPricePerNight.Value).OrderByDescending(h => h.Rating).FirstOrDefault() ??
                            hotels.OrderBy(h => h.PricePerNight).First();
        }
        else
        {
            // Pick second best or alternative hotel
            selectedHotel = hotels.FirstOrDefault(h => !h.Name.Equals(trip.ChosenHotelName, StringComparison.OrdinalIgnoreCase)) ?? hotels.First();
        }

        var hotelDto = MapHotelToDto(selectedHotel, destinationEntity.Name);

        // Calculate revised budget
        var revisedBudget = _budgetService.CalculateBudget(
            destinationEntity.TravelCostPerPerson,
            selectedHotel.PricePerNight,
            trip.Nights,
            trip.Travellers,
            targetBudget,
            activitiesCostPerPerson: userWantsCheaper ? 600 : 1200);

        var constraints = new TripConstraints
        {
            FromCity = trip.OriginCity,
            Destination = destinationEntity.Name,
            BudgetInRupees = targetBudget,
            Nights = trip.Nights,
            Travellers = trip.Travellers,
            Interests = trip.Interests,
            Notes = userPrompt
        };

        string explanation = await _aiService.GenerateReplanExplanationAsync(
            trip.DestinationName,
            destinationEntity.Name,
            trip.ChosenHotelName,
            selectedHotel.Name,
            trip.EstimatedTotalCost,
            revisedBudget.TotalEstimatedCost,
            targetBudget,
            userPrompt,
            ct);

        var daysPlan = await _aiService.GenerateItineraryAsync(constraints, destinationDto, hotelDto, weather, destinationDto.Activities, ct);
        var packingTip = await _aiService.GeneratePackingTipAsync(destinationEntity.Name, weather, ct);

        // Update trip entity in DB
        trip.DestinationName = destinationEntity.Name;
        trip.DestinationId = destinationEntity.Id;
        trip.ChosenHotelName = selectedHotel.Name;
        trip.ChosenHotelPricePerNight = selectedHotel.PricePerNight;
        trip.TotalBudget = targetBudget;
        trip.EstimatedTotalCost = revisedBudget.TotalEstimatedCost;
        trip.RemainingBudget = revisedBudget.RemainingBudget;
        trip.TravelCost = revisedBudget.TravelCost;
        trip.HotelCost = revisedBudget.HotelCost;
        trip.FoodCost = revisedBudget.FoodCost;
        trip.ActivitiesCost = revisedBudget.ActivitiesCost;
        trip.MiscCost = revisedBudget.MiscCost;
        trip.AiExplanation = explanation;
        trip.PackingTip = packingTip;
        trip.ReplanNotes = $"Adjusted according to request: \"{userPrompt}\". Updated stay to {selectedHotel.Name}.";
        trip.Status = TripStatus.Replanned;
        trip.UpdatedAt = DateTime.UtcNow;

        // Update itinerary days
        trip.ItineraryDays.Clear();
        foreach (var dp in daysPlan)
        {
            trip.ItineraryDays.Add(new ItineraryDay
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

        await _tripRepo.UpdateAsync(trip, ct);

        return new TripPlanResponse
        {
            TripId = trip.Id,
            Title = $"Replanned: Trip to {destinationEntity.Name}",
            OriginCity = trip.OriginCity,
            Destination = destinationDto,
            ChosenHotel = hotelDto,
            Weather = weather,
            Travellers = trip.Travellers,
            Nights = trip.Nights,
            Days = trip.Days,
            Budget = revisedBudget,
            AiExplanation = explanation,
            IsReplanned = true,
            ReplanNotes = trip.ReplanNotes,
            DaysPlan = daysPlan,
            PackingTip = packingTip,
            CreatedAt = trip.CreatedAt,
            IsSaved = true
        };
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
