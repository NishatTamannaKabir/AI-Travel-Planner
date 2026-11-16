using System;
using System.Collections.Generic;
using AITravelPlanner.Application.DTOs.Destinations;

namespace AITravelPlanner.Application.DTOs.Trips;

public class TripPlanResponse
{
    public int TripId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string OriginCity { get; set; } = string.Empty;
    public DestinationDto Destination { get; set; } = new();
    public HotelDto ChosenHotel { get; set; } = new();
    public WeatherForecastDto Weather { get; set; } = new();

    public int Travellers { get; set; }
    public int Nights { get; set; }
    public int Days { get; set; }

    public BudgetBreakdownDto Budget { get; set; } = new();

    public string AiExplanation { get; set; } = string.Empty;
    public string PackingTip { get; set; } = string.Empty;

    public bool IsReplanned { get; set; }
    public string? ReplanNotes { get; set; }
    public List<string> Warnings { get; set; } = new();

    public List<DayPlanDto> DaysPlan { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public bool IsSaved { get; set; }
}
