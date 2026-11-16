using System;

namespace AITravelPlanner.Application.DTOs.Trips;

public class TripSummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string DestinationName { get; set; } = string.Empty;
    public string OriginCity { get; set; } = string.Empty;
    public decimal TotalBudget { get; set; }
    public decimal EstimatedTotalCost { get; set; }
    public bool WithinBudget { get; set; }
    public int Travellers { get; set; }
    public int Days { get; set; }
    public int Nights { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string HotelName { get; set; } = string.Empty;
    public string WeatherSummary { get; set; } = string.Empty;
}
