namespace AITravelPlanner.Domain.Entities;

public class ItineraryDay
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public int DayNumber { get; set; }
    public string DayName { get; set; } = string.Empty; // e.g. "Day 1 - Friday"
    public string MorningActivity { get; set; } = string.Empty;
    public string AfternoonActivity { get; set; } = string.Empty;
    public string EveningActivity { get; set; } = string.Empty;
    public decimal EstimatedDailyCost { get; set; }
    public string Notes { get; set; } = string.Empty;
}
