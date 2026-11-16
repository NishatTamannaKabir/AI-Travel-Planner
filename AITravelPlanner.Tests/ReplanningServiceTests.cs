using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Application.Services;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Domain.Enums;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace AITravelPlanner.Tests;

public class ReplanningServiceTests
{
    private readonly Mock<IDestinationRepository> _mockDestRepo = new();
    private readonly Mock<IHotelRepository> _mockHotelRepo = new();
    private readonly Mock<IWeatherService> _mockWeatherService = new();
    private readonly Mock<IAIService> _mockAiService = new();
    private readonly Mock<ITripRepository> _mockTripRepo = new();
    private readonly BudgetService _budgetService = new();

    private readonly ReplanningService _replanningService;

    public ReplanningServiceTests()
    {
        _replanningService = new ReplanningService(
            _mockDestRepo.Object,
            _mockHotelRepo.Object,
            _mockWeatherService.Object,
            _budgetService,
            _mockAiService.Object,
            _mockTripRepo.Object,
            NullLogger<ReplanningService>.Instance);
    }

    [Fact]
    public async Task AttemptAutomaticBudgetRecovery_CheaperHotelAvailable_SwitchesHotelAndSucceeds()
    {
        // Arrange
        var destination = new DestinationDto
        {
            Id = 1,
            Name = "Goa",
            TravelCostPerPerson = 4000,
            Tags = "beach, nightlife"
        };

        var expensiveHotel = new HotelDto
        {
            Id = 10,
            DestinationId = 1,
            Name = "Luxury Beachfront Villa",
            PricePerNight = 12000
        };

        var overBudgetBreakdown = new BudgetBreakdownDto
        {
            TotalEstimatedCost = 40000,
            TotalBudget = 30000,
            RemainingBudget = -10000
        };

        var weather = new WeatherForecastDto
        {
            Destination = "Goa",
            Condition = "Sunny",
            HasHeavyRain = false
        };

        var constraints = new TripConstraints
        {
            FromCity = "Kolkata",
            Destination = "Goa",
            BudgetInRupees = 30000,
            Nights = 2,
            Travellers = 2,
            Interests = "beach"
        };

        var hotelsInDest = new List<Hotel>
        {
            new Hotel { Id = 10, DestinationId = 1, Name = "Luxury Beachfront Villa", PricePerNight = 12000 },
            new Hotel { Id = 11, DestinationId = 1, Name = "Baga Cozy Inn", PricePerNight = 2000, Rating = 4.2 }
        };

        _mockHotelRepo.Setup(r => r.GetByDestinationAsync("Goa", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(hotelsInDest);

        _mockAiService.Setup(a => a.GenerateReplanExplanationAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("Switched to budget hotel to fit budget.");

        _mockAiService.Setup(a => a.GenerateItineraryAsync(
            It.IsAny<TripConstraints>(), It.IsAny<DestinationDto>(), It.IsAny<HotelDto>(),
            It.IsAny<WeatherForecastDto>(), It.IsAny<List<ActivityDto>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<DayPlanDto> { new DayPlanDto { DayNumber = 1, DayName = "Day 1" } });

        _mockAiService.Setup(a => a.GeneratePackingTipAsync(It.IsAny<string>(), It.IsAny<WeatherForecastDto>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("Pack sunscreen.");

        // Act
        var result = await _replanningService.AttemptAutomaticBudgetRecoveryAsync(
            constraints, destination, expensiveHotel, overBudgetBreakdown, weather);

        // Assert
        result.Should().NotBeNull();
        result!.IsReplanned.Should().BeTrue();
        result.ChosenHotel.Name.Should().Be("Baga Cozy Inn");
        result.Budget.WithinBudget.Should().BeTrue();
        result.ReplanNotes.Should().Contain("exceeded the budget");
    }

    [Fact]
    public async Task ReplanAsync_UserRequestsCheaper_SwitchesToEconomyHotel()
    {
        // Arrange
        var existingTrip = new Trip
        {
            Id = 5,
            OriginCity = "Kolkata",
            DestinationName = "Puri",
            ChosenHotelName = "Golden Beach Resort",
            ChosenHotelPricePerNight = 4500,
            TotalBudget = 25000,
            EstimatedTotalCost = 28000,
            Travellers = 2,
            Nights = 2,
            Days = 3,
            Status = TripStatus.Planned,
            Destination = new Destination
            {
                Id = 2,
                Name = "Puri",
                TravelCostPerPerson = 3000,
                Tags = "beach, temple"
            }
        };

        _mockTripRepo.Setup(r => r.GetByIdWithDetailsAsync(5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingTrip);

        _mockDestRepo.Setup(d => d.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Destination> { existingTrip.Destination! });

        var hotels = new List<Hotel>
        {
            new Hotel { Id = 20, DestinationId = 2, Name = "Golden Beach Resort", PricePerNight = 4500, Rating = 4.6 },
            new Hotel { Id = 21, DestinationId = 2, Name = "Sea Breeze Economy", PricePerNight = 1800, Rating = 4.0 }
        };

        _mockHotelRepo.Setup(r => r.GetByDestinationAsync("Puri", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(hotels);

        _mockWeatherService.Setup(w => w.GetWeatherForecastAsync("Puri", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new WeatherForecastDto { Destination = "Puri", Condition = "Sunny" });

        _mockAiService.Setup(a => a.GenerateReplanExplanationAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("Plan updated to economy hotel.");

        _mockAiService.Setup(a => a.GenerateItineraryAsync(
            It.IsAny<TripConstraints>(), It.IsAny<DestinationDto>(), It.IsAny<HotelDto>(),
            It.IsAny<WeatherForecastDto>(), It.IsAny<List<ActivityDto>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<DayPlanDto> { new DayPlanDto { DayNumber = 1, DayName = "Day 1" } });

        var request = new ReplanTripRequest
        {
            TripId = 5,
            UserChangeRequest = "Please make it cheaper"
        };

        // Act
        var result = await _replanningService.ReplanAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.ChosenHotel.Name.Should().Be("Sea Breeze Economy");
        result.Budget.WithinBudget.Should().BeTrue();
        result.IsReplanned.Should().BeTrue();
        _mockTripRepo.Verify(r => r.UpdateAsync(It.IsAny<Trip>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5000)]
    public async Task ReplanAsync_TargetBudgetZeroOrNegative_ThrowsArgumentException(decimal invalidBudget)
    {
        // Arrange
        var request = new ReplanTripRequest
        {
            TripId = 5,
            UserChangeRequest = "Adjust budget",
            NewTargetBudget = invalidBudget
        };

        var existingTrip = new Trip { Id = 5, TotalBudget = 25000, DestinationName = "Puri" };
        _mockTripRepo.Setup(r => r.GetByIdWithDetailsAsync(5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingTrip);

        // Act
        Func<Task> act = async () => await _replanningService.ReplanAsync(request);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*positive whole number*");
    }

    [Fact]
    public async Task ReplanAsync_TargetBudgetExceedsMaximum_ThrowsArgumentException()
    {
        // Arrange
        var request = new ReplanTripRequest
        {
            TripId = 5,
            UserChangeRequest = "Adjust budget to ultra luxury",
            NewTargetBudget = 30000000m // 3 crore
        };

        var existingTrip = new Trip { Id = 5, TotalBudget = 25000, DestinationName = "Puri" };
        _mockTripRepo.Setup(r => r.GetByIdWithDetailsAsync(5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingTrip);

        // Act
        Func<Task> act = async () => await _replanningService.ReplanAsync(request);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*cannot exceed ₹1,00,00,000*");
    }

    [Fact]
    public async Task ReplanAsync_TargetBudgetTooLowForFeasibility_ThrowsArgumentException()
    {
        // Arrange
        // For Puri with 2 travellers, 2 nights (3 days):
        // minTravel: 3000 * 2 = 6000
        // minHotel: 1800 * 2 nights * 1 room = 3600
        // minFood: 800 * 2 travellers * 3 days = 4800
        // minFeasibleCost = 6000 + 3600 + 4800 = 14,400
        // Target budget = 3 (or 5000) is far below 14,400!
        var existingTrip = new Trip
        {
            Id = 5,
            OriginCity = "Kolkata",
            DestinationName = "Puri",
            ChosenHotelName = "Golden Beach Resort",
            ChosenHotelPricePerNight = 4500,
            TotalBudget = 25000,
            EstimatedTotalCost = 28000,
            Travellers = 2,
            Nights = 2,
            Days = 3,
            Destination = new Destination
            {
                Id = 2,
                Name = "Puri",
                TravelCostPerPerson = 3000
            }
        };

        _mockTripRepo.Setup(r => r.GetByIdWithDetailsAsync(5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingTrip);

        var hotels = new List<Hotel>
        {
            new Hotel { Id = 21, DestinationId = 2, Name = "Sea Breeze Economy", PricePerNight = 1800 }
        };
        _mockHotelRepo.Setup(r => r.GetByDestinationAsync("Puri", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(hotels);

        var request = new ReplanTripRequest
        {
            TripId = 5,
            UserChangeRequest = "Make it super cheap",
            NewTargetBudget = 3m // ₹3 budget!
        };

        // Act
        Func<Task> act = async () => await _replanningService.ReplanAsync(request);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*too low for this trip*");
    }
}
