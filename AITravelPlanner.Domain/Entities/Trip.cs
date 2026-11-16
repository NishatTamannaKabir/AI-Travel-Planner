using System;
using System.Collections.Generic;
using AITravelPlanner.Domain.Enums;

namespace AITravelPlanner.Domain.Entities;

public class Trip
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }

    public string Title { get; set; } = string.Empty;
    public string OriginCity { get; set; } = string.Empty;
    public string DestinationName { get; set; } = string.Empty;
    public int? DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public decimal TotalBudget { get; set; }
    public decimal EstimatedTotalCost { get; set; }
    public decimal RemainingBudget { get; set; }
    public bool WithinBudget => EstimatedTotalCost <= TotalBudget;

    public int Travellers { get; set; } = 1;
    public int Nights { get; set; } = 2;
    public int Days { get; set; } = 3;

    public TripStatus Status { get; set; } = TripStatus.Planned;
    public string Interests { get; set; } = string.Empty;
    public string WeatherSummary { get; set; } = string.Empty;

    public string ChosenHotelName { get; set; } = string.Empty;
    public decimal ChosenHotelPricePerNight { get; set; }

    public decimal TravelCost { get; set; }
    public decimal HotelCost { get; set; }
    public decimal FoodCost { get; set; }
    public decimal ActivitiesCost { get; set; }
    public decimal MiscCost { get; set; }

    public string AiExplanation { get; set; } = string.Empty;
    public string PackingTip { get; set; } = string.Empty;
    public string? ReplanNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<TripTraveller> TravellersList { get; set; } = new List<TripTraveller>();
    public ICollection<ItineraryDay> ItineraryDays { get; set; } = new List<ItineraryDay>();
    public ICollection<SavedPlan> SavedPlans { get; set; } = new List<SavedPlan>();
}
