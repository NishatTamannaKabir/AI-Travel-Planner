using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;

namespace AITravelPlanner.Application.Interfaces;

public interface IAIService
{
    Task<TripConstraints> ExtractConstraintsAsync(string prompt, CancellationToken ct = default);

    Task<string> GenerateExplanationAsync(
        TripConstraints constraints,
        DestinationDto destination,
        HotelDto hotel,
        BudgetBreakdownDto budget,
        WeatherForecastDto weather,
        bool isReplanned = false,
        string? replanReason = null,
        CancellationToken ct = default);

    Task<List<DayPlanDto>> GenerateItineraryAsync(
        TripConstraints constraints,
        DestinationDto destination,
        HotelDto hotel,
        WeatherForecastDto weather,
        List<ActivityDto> availableActivities,
        CancellationToken ct = default);

    Task<string> GeneratePackingTipAsync(
        string destination,
        WeatherForecastDto weather,
        CancellationToken ct = default);

    Task<string> GenerateReplanExplanationAsync(
        string originalDestination,
        string newDestination,
        string originalHotel,
        string newHotel,
        decimal originalCost,
        decimal newCost,
        decimal budget,
        string userChangeRequest,
        CancellationToken ct = default);
}
