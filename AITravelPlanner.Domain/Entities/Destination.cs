using System;
using System.Collections.Generic;

namespace AITravelPlanner.Domain.Entities;

public class Destination
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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Hotel> Hotels { get; set; } = new List<Hotel>();
    public ICollection<Activity> Activities { get; set; } = new List<Activity>();
}
