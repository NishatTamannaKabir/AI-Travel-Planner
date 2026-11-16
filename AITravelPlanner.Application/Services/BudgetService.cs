using System;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;

namespace AITravelPlanner.Application.Services;

public class BudgetService : IBudgetService
{
    public BudgetBreakdownDto CalculateBudget(
        decimal travelCostPerPerson,
        decimal hotelPricePerNight,
        int nights,
        int travellers,
        decimal totalBudget,
        decimal activitiesCostPerPerson = 0,
        decimal foodPerPersonPerDay = 1500,
        decimal miscBufferPercentage = 0.05m)
    {
        if (travellers < 1) travellers = 1;
        if (nights < 1) nights = 1;
        int days = nights + 1;

        // Group room allocation: 1 room for 1-2 people, 2 rooms for 3-4, etc.
        int roomsRequired = (int)Math.Ceiling(travellers / 2.0);

        decimal travelTotal = travelCostPerPerson * travellers;
        decimal hotelTotal = hotelPricePerNight * nights * roomsRequired;
        decimal foodTotal = foodPerPersonPerDay * travellers * days;
        decimal activitiesTotal = activitiesCostPerPerson * travellers;

        decimal subtotal = travelTotal + hotelTotal + foodTotal + activitiesTotal;
        decimal miscTotal = Math.Round(subtotal * miscBufferPercentage, 0);
        decimal grandTotal = subtotal + miscTotal;

        decimal remaining = totalBudget - grandTotal;
        decimal perTraveller = Math.Round(grandTotal / travellers, 2);

        string verdict = grandTotal <= totalBudget
            ? $"WITHIN budget (₹{remaining:N0} remaining buffer)"
            : $"OVER budget by ₹{Math.Abs(remaining):N0}";

        return new BudgetBreakdownDto
        {
            TravelCost = travelTotal,
            HotelCost = hotelTotal,
            FoodCost = foodTotal,
            ActivitiesCost = activitiesTotal,
            MiscCost = miscTotal,
            TotalEstimatedCost = grandTotal,
            TotalBudget = totalBudget,
            RemainingBudget = remaining,
            CostPerTraveller = perTraveller,
            VerdictSummary = verdict
        };
    }

    public decimal CalculateMinimumFeasibleCost(
        decimal minTravelCostPerPerson,
        decimal minHotelPricePerNight,
        int nights,
        int travellers)
    {
        if (travellers < 1) travellers = 1;
        if (nights < 1) nights = 1;
        int days = nights + 1;
        int roomsRequired = (int)Math.Ceiling(travellers / 2.0);

        decimal bareMinimum = (minTravelCostPerPerson * travellers)
                            + (minHotelPricePerNight * nights * roomsRequired)
                            + (800m * travellers * days); // budget food threshold

        return bareMinimum;
    }

    public bool IsBudgetFeasible(
        decimal totalBudget,
        decimal minTravelCostPerPerson,
        decimal minHotelPricePerNight,
        int nights,
        int travellers)
    {
        decimal minimumFeasible = CalculateMinimumFeasibleCost(minTravelCostPerPerson, minHotelPricePerNight, nights, travellers);
        return totalBudget >= minimumFeasible;
    }

    public decimal SuggestMaxHotelRate(
        decimal totalBudget,
        decimal travelCostPerPerson,
        int nights,
        int travellers,
        decimal foodPerPersonPerDay = 1500)
    {
        if (travellers < 1) travellers = 1;
        if (nights < 1) nights = 1;
        int days = nights + 1;
        int roomsRequired = (int)Math.Ceiling(travellers / 2.0);

        decimal nonHotelCosts = (travelCostPerPerson * travellers) + (foodPerPersonPerDay * travellers * days);
        decimal availableForHotel = totalBudget - nonHotelCosts;

        if (availableForHotel <= 0) return 0;

        decimal maxNightly = availableForHotel / (nights * roomsRequired);
        return Math.Max(0, Math.Floor(maxNightly));
    }
}
