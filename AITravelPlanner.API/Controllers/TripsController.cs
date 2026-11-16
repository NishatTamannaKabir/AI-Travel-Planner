using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Common;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AITravelPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly ITravelPlanningService _planningService;
    private readonly ILogger<TripsController> _logger;

    public TripsController(ITravelPlanningService planningService, ILogger<TripsController> logger)
    {
        _planningService = planningService;
        _logger = logger;
    }

    /// <summary>
    /// Plans a complete customized trip from natural language prompt or structured parameters.
    /// Supports anonymous planning or authenticated user planning.
    /// </summary>
    [HttpPost("plan")]
    public async Task<ActionResult<ApiResponse<TripPlanResponse>>> PlanTrip([FromBody] PlanTripRequest request, CancellationToken ct)
    {
        int? userId = GetCurrentUserId();
        _logger.LogInformation("Received trip plan request. User: {UserId}", userId?.ToString() ?? "Anonymous");

        var plan = await _planningService.PlanTripAsync(request, userId, ct);
        return Ok(ApiResponse<TripPlanResponse>.Ok(plan, "Trip planned successfully by AI."));
    }

    /// <summary>
    /// Intelligently replans an existing trip based on constraints or "make it cheaper" request.
    /// </summary>
    [HttpPost("replan")]
    public async Task<ActionResult<ApiResponse<TripPlanResponse>>> ReplanTrip([FromBody] ReplanTripRequest request, CancellationToken ct)
    {
        int? userId = GetCurrentUserId();
        _logger.LogInformation("Replanning trip {TripId}. Prompt: '{UserPrompt}'", request.TripId, request.UserChangeRequest);

        var plan = await _planningService.ReplanTripAsync(request, userId, ct);
        return Ok(ApiResponse<TripPlanResponse>.Ok(plan, "Trip replanned successfully by AI."));
    }

    /// <summary>
    /// Saves a planned trip to the authenticated user's portfolio.
    /// </summary>
    [Authorize]
    [HttpPost("{id}/save")]
    public async Task<ActionResult<ApiResponse<TripPlanResponse>>> SaveTrip(int id, CancellationToken ct)
    {
        int userId = GetRequiredUserId();
        var saved = await _planningService.SaveTripAsync(id, userId, ct);
        return Ok(ApiResponse<TripPlanResponse>.Ok(saved, "Trip successfully saved to your dashboard."));
    }

    /// <summary>
    /// Retrieves all saved trips for the authenticated user.
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TripSummaryDto>>>> GetUserTrips(CancellationToken ct)
    {
        int userId = GetRequiredUserId();
        var trips = await _planningService.GetUserTripsAsync(userId, ct);
        return Ok(ApiResponse<List<TripSummaryDto>>.Ok(trips));
    }

    /// <summary>
    /// Gets full details of a specific trip by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<TripPlanResponse>>> GetTripById(int id, CancellationToken ct)
    {
        int? userId = GetCurrentUserId();
        var trip = await _planningService.GetTripByIdAsync(id, userId, ct);
        if (trip == null)
        {
            return NotFound(ApiResponse<TripPlanResponse>.Fail($"Trip with ID {id} was not found."));
        }

        return Ok(ApiResponse<TripPlanResponse>.Ok(trip));
    }

    /// <summary>
    /// Deletes a saved trip from the user's account.
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteTrip(int id, CancellationToken ct)
    {
        int userId = GetRequiredUserId();
        bool deleted = await _planningService.DeleteTripAsync(id, userId, ct);
        if (!deleted)
        {
            return NotFound(ApiResponse<bool>.Fail("Trip not found or you do not have permission to delete it."));
        }

        return Ok(ApiResponse<bool>.Ok(true, "Trip deleted successfully."));
    }

    private int? GetCurrentUserId()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(idStr, out int id) ? id : null;
    }

    private int GetRequiredUserId()
    {
        var id = GetCurrentUserId();
        if (!id.HasValue)
        {
            throw new System.UnauthorizedAccessException("User is not authenticated.");
        }
        return id.Value;
    }
}
