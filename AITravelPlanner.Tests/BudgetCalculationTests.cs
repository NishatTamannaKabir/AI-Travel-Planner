using AITravelPlanner.Application.Services;
using FluentAssertions;
using Xunit;

namespace AITravelPlanner.Tests;

public class BudgetCalculationTests
{
    private readonly BudgetService _budgetService = new();

    [Fact]
    public void CalculateBudget_StandardTrip_CalculatesAccurately()
    {
        // Arrange
        // 2 travellers, 2 nights (3 days)
        // Travel: 3000/person -> 6000
        // Hotel: 2000/night (1 room) -> 4000
        // Food: 1500/person/day * 2 people * 3 days -> 9000
        // Activities: 1000/person * 2 people -> 2000
        // Subtotal = 21,000. Misc (5%) = 1,050. Total = 22,050
        // Budget = 30,000. Remaining = 7,950
        decimal travelCost = 3000;
        decimal hotelPrice = 2000;
        int nights = 2;
        int travellers = 2;
        decimal totalBudget = 30000;
        decimal activities = 1000;

        // Act
        var result = _budgetService.CalculateBudget(travelCost, hotelPrice, nights, travellers, totalBudget, activities);

        // Assert
        result.TravelCost.Should().Be(6000);
        result.HotelCost.Should().Be(4000);
        result.FoodCost.Should().Be(9000);
        result.ActivitiesCost.Should().Be(2000);
        result.MiscCost.Should().Be(1050);
        result.TotalEstimatedCost.Should().Be(22050);
        result.RemainingBudget.Should().Be(7950);
        result.WithinBudget.Should().BeTrue();
        result.CostPerTraveller.Should().Be(11025);
    }

    [Fact]
    public void CalculateBudget_OverBudget_SetsWithinBudgetFalseAndComputesDeficit()
    {
        // Arrange
        decimal travelCost = 9000; // Goa from Kolkata
        decimal hotelPrice = 5500;
        int nights = 3;
        int travellers = 2;
        decimal totalBudget = 30000; // Insufficient for premium Goa

        // Act
        var result = _budgetService.CalculateBudget(travelCost, hotelPrice, nights, travellers, totalBudget);

        // Assert
        result.WithinBudget.Should().BeFalse();
        result.OverBudgetBy.Should().BeGreaterThan(0);
        result.RemainingBudget.Should().BeLessThan(0);
        result.VerdictSummary.Should().Contain("OVER budget");
    }

    [Fact]
    public void CalculateBudget_MultiTravellerRooms_AllocatesCorrectNumberOfRooms()
    {
        // 4 travellers require 2 rooms: (4 / 2 = 2)
        // Hotel: 3000/night * 2 nights * 2 rooms = 12000
        var result = _budgetService.CalculateBudget(
            travelCostPerPerson: 2000,
            hotelPricePerNight: 3000,
            nights: 2,
            travellers: 4,
            totalBudget: 50000);

        result.HotelCost.Should().Be(12000);
    }

    [Theory]
    [InlineData(30000, 3000, 1500, 2, 2, true)]
    [InlineData(10000, 9000, 5000, 3, 2, false)]
    public void IsBudgetFeasible_ReturnsExpectedResult(
        decimal totalBudget, decimal travelCost, decimal hotelRate, int nights, int travellers, bool expected)
    {
        bool feasible = _budgetService.IsBudgetFeasible(totalBudget, travelCost, hotelRate, nights, travellers);
        feasible.Should().Be(expected);
    }

    [Fact]
    public void SuggestMaxHotelRate_ComputesRealisticCeiling()
    {
        // Budget: 30,000. Travel: 3000 * 2 = 6,000. Food: 1500 * 2 * 3 = 9,000.
        // Available for hotel = 30,000 - 15,000 = 15,000.
        // Nights = 2, Rooms = 1 -> Max per night = 7,500
        decimal maxRate = _budgetService.SuggestMaxHotelRate(30000, 3000, 2, 2);
        maxRate.Should().Be(7500);
    }
}
