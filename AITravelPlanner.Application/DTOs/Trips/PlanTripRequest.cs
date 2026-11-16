using System.ComponentModel.DataAnnotations;

namespace AITravelPlanner.Application.DTOs.Trips;

public class PlanTripRequest
{
    /// <summary>
    /// Free-form natural language query, e.g.:
    /// "I want a 4 day trip from Kolkata for 2 people under ₹30,000. I like beaches and I don't want heavy rain."
    /// </summary>
    public string? Prompt { get; set; }

    public string? FromCity { get; set; } = "Kolkata";
    public string? Destination { get; set; }

    [Range(1000, 10000000, ErrorMessage = "Budget must be at least ₹1,000.")]
    public decimal? BudgetInRupees { get; set; }

    [Range(1, 30, ErrorMessage = "Travellers must be between 1 and 30.")]
    public int? Travellers { get; set; }

    [Range(1, 30, ErrorMessage = "Days must be between 1 and 30.")]
    public int? Days { get; set; }

    public string? Interests { get; set; }
    public string? WeatherPreference { get; set; }
    public string? Notes { get; set; }
}
