using System.ComponentModel;

namespace AITravelPlanner.Application.DTOs.Trips;

public class DayPlanDto
{
    [Description("Day number, starting from 1")]
    public int DayNumber { get; set; }

    [Description("Day label, e.g. Day 1 - Friday")]
    public string DayName { get; set; } = string.Empty;

    [Description("Morning activity")]
    public string Morning { get; set; } = string.Empty;

    [Description("Afternoon activity")]
    public string Afternoon { get; set; } = string.Empty;

    [Description("Evening activity")]
    public string Evening { get; set; } = string.Empty;

    [Description("Estimated daily expenses for meals, local transport, entrance fees")]
    public decimal EstimatedDailyCost { get; set; }

    [Description("Helpful tips or local recommendations")]
    public string Notes { get; set; } = string.Empty;
}
