using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;

namespace AITravelPlanner.Application.Interfaces;

public interface IReplanningService
{
    Task<TripPlanResponse> ReplanAsync(ReplanTripRequest request, int? userId = null, CancellationToken ct = default);

    Task<TripPlanResponse?> AttemptAutomaticBudgetRecoveryAsync(
        TripConstraints constraints,
        DestinationDto currentDestination,
        HotelDto currentHotel,
        BudgetBreakdownDto initialBudget,
        WeatherForecastDto currentWeather,
        CancellationToken ct = default);
}

public interface ITravelPlanningService
{
    Task<TripPlanResponse> PlanTripAsync(PlanTripRequest request, int? userId = null, CancellationToken ct = default);
    Task<TripPlanResponse> ReplanTripAsync(ReplanTripRequest request, int? userId = null, CancellationToken ct = default);
    Task<TripPlanResponse> SaveTripAsync(int tripId, int userId, CancellationToken ct = default);
    Task<List<TripSummaryDto>> GetUserTripsAsync(int userId, CancellationToken ct = default);
    Task<TripPlanResponse?> GetTripByIdAsync(int tripId, int? userId = null, CancellationToken ct = default);
    Task<bool> DeleteTripAsync(int tripId, int userId, CancellationToken ct = default);
}
