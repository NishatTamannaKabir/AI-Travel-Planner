using System;

namespace AITravelPlanner.Domain.Entities;

public class SavedPlan
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public string PlanTitle { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    public string PlanJson { get; set; } = string.Empty;
}
