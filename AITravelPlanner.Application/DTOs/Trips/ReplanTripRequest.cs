using System.ComponentModel.DataAnnotations;

namespace AITravelPlanner.Application.DTOs.Trips;

public class ReplanTripRequest
{
    [Required(ErrorMessage = "TripId is required.")]
    public int TripId { get; set; }

    /// <summary>
    /// Natural language instructions, e.g. "make it cheaper", "switch hotel to budget", "avoid rainy destinations", "add adventure activities"
    /// </summary>
    [Required(ErrorMessage = "Please specify what you would like to adjust.")]
    public string UserChangeRequest { get; set; } = string.Empty;

    [Range(1, 10000000, ErrorMessage = "Target budget must be between ₹1 and ₹1,00,00,000 (₹1 crore).")]
    public decimal? NewTargetBudget { get; set; }

    public string? PreferredDestination { get; set; }
    public decimal? MaxHotelPricePerNight { get; set; }
}
