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
public class HotelsController : ControllerBase
{
    private readonly IHotelRepository _hotelRepository;

    public HotelsController(IHotelRepository hotelRepository)
    {
        _hotelRepository = hotelRepository;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<HotelDto>>>> GetAll(CancellationToken ct)
    {
        var hotels = await _hotelRepository.GetAllAsync(ct);
        var dtos = hotels.Select(h => new HotelDto
        {
            Id = h.Id,
            DestinationId = h.DestinationId,
            DestinationName = h.Destination?.Name ?? "",
            Name = h.Name,
            Description = h.Description,
            PricePerNight = h.PricePerNight,
            Rating = h.Rating,
            Amenities = h.Amenities,
            Address = h.Address,
            ImageUrl = h.ImageUrl
        }).ToList();

        return Ok(ApiResponse<List<HotelDto>>.Ok(dtos));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<HotelDto>>> GetById(int id, CancellationToken ct)
    {
        var h = await _hotelRepository.GetByIdAsync(id, ct);
        if (h == null)
        {
            return NotFound(ApiResponse<HotelDto>.Fail($"Hotel with ID {id} not found."));
        }

        var dto = new HotelDto
        {
            Id = h.Id,
            DestinationId = h.DestinationId,
            DestinationName = h.Destination?.Name ?? "",
            Name = h.Name,
            Description = h.Description,
            PricePerNight = h.PricePerNight,
            Rating = h.Rating,
            Amenities = h.Amenities,
            Address = h.Address,
            ImageUrl = h.ImageUrl
        };

        return Ok(ApiResponse<HotelDto>.Ok(dto));
    }

    [HttpGet("destination/{destination}")]
    public async Task<ActionResult<ApiResponse<List<HotelDto>>>> GetByDestination(string destination, [FromQuery] decimal? maxPrice, CancellationToken ct)
    {
        var hotels = await _hotelRepository.GetByDestinationAsync(destination, maxPrice, ct);
        var dtos = hotels.Select(h => new HotelDto
        {
            Id = h.Id,
            DestinationId = h.DestinationId,
            DestinationName = h.Destination?.Name ?? destination,
            Name = h.Name,
            Description = h.Description,
            PricePerNight = h.PricePerNight,
            Rating = h.Rating,
            Amenities = h.Amenities,
            Address = h.Address,
            ImageUrl = h.ImageUrl
        }).ToList();

        return Ok(ApiResponse<List<HotelDto>>.Ok(dtos));
    }
}
