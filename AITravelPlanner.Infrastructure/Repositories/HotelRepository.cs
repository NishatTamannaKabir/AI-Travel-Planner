using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AITravelPlanner.Infrastructure.Repositories;

public class HotelRepository : IHotelRepository
{
    private readonly TravelDbContext _context;

    public HotelRepository(TravelDbContext context)
    {
        _context = context;
    }

    public async Task<List<Hotel>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Hotels
            .Include(h => h.Destination)
            .OrderBy(h => h.PricePerNight)
            .ToListAsync(ct);
    }

    public async Task<Hotel?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Hotels
            .Include(h => h.Destination)
            .FirstOrDefaultAsync(h => h.Id == id, ct);
    }

    public async Task<List<Hotel>> GetByDestinationAsync(string destinationName, decimal? maxPrice = null, CancellationToken ct = default)
    {
        string trimmed = destinationName.Trim().ToLower();
        var query = _context.Hotels
            .Include(h => h.Destination)
            .Where(h => (h.Destination != null && h.Destination.Name.ToLower() == trimmed) ||
                        h.Name.ToLower().Contains(trimmed));

        if (maxPrice.HasValue && maxPrice.Value > 0)
        {
            query = query.Where(h => h.PricePerNight <= maxPrice.Value);
        }

        return await query.OrderBy(h => h.PricePerNight).ToListAsync(ct);
    }
}
