using System.ComponentModel;

namespace AITravelPlanner.Application.DTOs.Trips;

/// <summary>
/// Structured travel constraints parsed from natural language or direct form input.
/// </summary>
public class TripConstraints
{
    [Description("Origin city the user starts from (e.g., Kolkata, Delhi, Mumbai, Bangalore)")]
    public string FromCity { get; set; } = string.Empty;

    [Description("Specific destination name requested by user, or empty if AI should choose")]
    public string? Destination { get; set; }

    [Description("Total budget for the whole trip in Indian Rupees (INR)")]
    public decimal BudgetInRupees { get; set; }

    [Description("Number of nights stay")]
    public int Nights { get; set; } = 2;

    [Description("Total number of days")]
    public int Days => Nights + 1;

    [Description("Number of travellers")]
    public int Travellers { get; set; } = 1;

    [Description("Keywords describing interests (e.g. beach, hills, tea, food, heritage, adventure, spiritual)")]
    public string Interests { get; set; } = string.Empty;

    [Description("Weather preferences, e.g. sunny, avoid heavy rain, cool, pleasant")]
    public string WeatherPreference { get; set; } = "Avoid heavy rain";

    [Description("Additional user notes or dietary/travel constraints")]
    public string? Notes { get; set; }
}
