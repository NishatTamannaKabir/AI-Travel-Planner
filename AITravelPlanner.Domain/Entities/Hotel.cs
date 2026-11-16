using System;

namespace AITravelPlanner.Domain.Entities;

public class Hotel
{
    public int Id { get; set; }
    public int DestinationId { get; set; }
    public Destination? Destination { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public double Rating { get; set; } = 4.0;
    public string Amenities { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
