using System;
using AITravelPlanner.Domain.Enums;

namespace AITravelPlanner.Domain.Entities;

public class Activity
{
    public int Id { get; set; }
    public int DestinationId { get; set; }
    public Destination? Destination { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal CostPerPerson { get; set; }
    public TimeOfDay TimeOfDay { get; set; } = TimeOfDay.Morning;
    public string Category { get; set; } = string.Empty; // Sightseeing, Adventure, Food, Heritage, Spiritual, Relaxation
}
