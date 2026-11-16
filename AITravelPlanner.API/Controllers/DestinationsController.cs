using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Common;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AITravelPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly IDestinationRepository _destinationRepository;

    public DestinationsController(IDestinationRepository destinationRepository)
    {
        _destinationRepository = destinationRepository;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<DestinationDto>>>> GetAll([FromQuery] string? interest, CancellationToken ct)
    {
        var destinations = string.IsNullOrWhiteSpace(interest)
            ? await _destinationRepository.GetAllAsync(ct)
            : await _destinationRepository.SearchByInterestsAsync(interest, ct);

        var dtos = destinations.Select(d => new DestinationDto
        {
            Id = d.Id,
            Name = d.Name,
            State = d.State,
            Description = d.Description,
            Tags = d.Tags,
            TravelCostPerPerson = d.TravelCostPerPerson,
            IdealDurationDays = d.IdealDurationDays,
            BestSeason = d.BestSeason,
            ImageUrl = d.ImageUrl,
            Hotels = d.Hotels?.Select(h => new HotelDto
            {
                Id = h.Id,
                DestinationId = h.DestinationId,
                DestinationName = d.Name,
                Name = h.Name,
                Description = h.Description,
                PricePerNight = h.PricePerNight,
                Rating = h.Rating,
                Amenities = h.Amenities,
                Address = h.Address,
                ImageUrl = h.ImageUrl
            }).ToList() ?? new(),
            Activities = d.Activities?.Select(a => new ActivityDto
            {
                Id = a.Id,
                DestinationId = a.DestinationId,
                DestinationName = d.Name,
                Name = a.Name,
                Description = a.Description,
                CostPerPerson = a.CostPerPerson,
                TimeOfDay = a.TimeOfDay.ToString(),
                Category = a.Category
            }).ToList() ?? new()
        }).ToList();

        return Ok(ApiResponse<List<DestinationDto>>.Ok(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<DestinationDto>>> GetById(int id, CancellationToken ct)
    {
        var d = await _destinationRepository.GetByIdAsync(id, ct);
        if (d == null)
        {
            return NotFound(ApiResponse<DestinationDto>.Fail($"Destination with ID {id} not found."));
        }

        var dto = new DestinationDto
        {
            Id = d.Id,
            Name = d.Name,
            State = d.State,
            Description = d.Description,
            Tags = d.Tags,
            TravelCostPerPerson = d.TravelCostPerPerson,
            IdealDurationDays = d.IdealDurationDays,
            BestSeason = d.BestSeason,
            ImageUrl = d.ImageUrl,
            Hotels = d.Hotels?.Select(h => new HotelDto
            {
                Id = h.Id,
                DestinationId = h.DestinationId,
                DestinationName = d.Name,
                Name = h.Name,
                Description = h.Description,
                PricePerNight = h.PricePerNight,
                Rating = h.Rating,
                Amenities = h.Amenities,
                Address = h.Address,
                ImageUrl = h.ImageUrl
            }).ToList() ?? new(),
            Activities = d.Activities?.Select(a => new ActivityDto
            {
                Id = a.Id,
                DestinationId = a.DestinationId,
                DestinationName = d.Name,
                Name = a.Name,
                Description = a.Description,
                CostPerPerson = a.CostPerPerson,
                TimeOfDay = a.TimeOfDay.ToString(),
                Category = a.Category
            }).ToList() ?? new()
        };

        return Ok(ApiResponse<DestinationDto>.Ok(dto));
    }
}
