using AITravelPlanner.Application.DTOs.Trips;

namespace AITravelPlanner.Application.Interfaces;

public interface IBudgetService
{
    BudgetBreakdownDto CalculateBudget(
        decimal travelCostPerPerson,
        decimal hotelPricePerNight,
        int nights,
        int travellers,
        decimal totalBudget,
        decimal activitiesCostPerPerson = 0,
        decimal foodPerPersonPerDay = 1500,
        decimal miscBufferPercentage = 0.05m);

    bool IsBudgetFeasible(
        decimal totalBudget,
        decimal minTravelCostPerPerson,
        decimal minHotelPricePerNight,
        int nights,
        int travellers);

    decimal CalculateMinimumFeasibleCost(
        decimal minTravelCostPerPerson,
        decimal minHotelPricePerNight,
        int nights,
        int travellers);

    decimal SuggestMaxHotelRate(
        decimal totalBudget,
        decimal travelCostPerPerson,
        int nights,
        int travellers,
        decimal foodPerPersonPerDay = 1500);
}
