using System.Collections.Generic;

namespace AITravelPlanner.Application.DTOs.Destinations;

public class DestinationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public decimal TravelCostPerPerson { get; set; }
    public int IdealDurationDays { get; set; } = 3;
    public string BestSeason { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<HotelDto> Hotels { get; set; } = new();
    public List<ActivityDto> Activities { get; set; } = new();
}

public class HotelDto
{
    public int Id { get; set; }
    public int DestinationId { get; set; }
    public string DestinationName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public double Rating { get; set; }
    public string Amenities { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

public class ActivityDto
{
    public int Id { get; set; }
    public int DestinationId { get; set; }
    public string DestinationName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal CostPerPerson { get; set; }
    public string TimeOfDay { get; set; } = "Morning";
    public string Category { get; set; } = string.Empty;
}

public class WeatherForecastDto
{
    public string Destination { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public int TemperatureCelsius { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool HasHeavyRain { get; set; }
    public string DetailedForecast { get; set; } = string.Empty;
}
