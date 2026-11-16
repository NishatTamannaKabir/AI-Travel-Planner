namespace AITravelPlanner.Domain.Entities;

public class TripTraveller
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public string Name { get; set; } = string.Empty;
    public int Age { get; set; } = 25;
    public string SpecialPreferences { get; set; } = string.Empty;
}
