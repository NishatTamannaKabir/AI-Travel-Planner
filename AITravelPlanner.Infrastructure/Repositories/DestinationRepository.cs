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

public class DestinationRepository : IDestinationRepository
{
    private readonly TravelDbContext _context;

    public DestinationRepository(TravelDbContext context)
    {
        _context = context;
    }

    public async Task<List<Destination>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Destinations
            .Include(d => d.Hotels)
            .Include(d => d.Activities)
            .OrderBy(d => d.Name)
            .ToListAsync(ct);
    }

    public async Task<Destination?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Destinations
            .Include(d => d.Hotels)
            .Include(d => d.Activities)
            .FirstOrDefaultAsync(d => d.Id == id, ct);
    }

    public async Task<Destination?> GetByNameAsync(string name, CancellationToken ct = default)
    {
        string trimmed = name.Trim().ToLower();
        return await _context.Destinations
            .Include(d => d.Hotels)
            .Include(d => d.Activities)
            .FirstOrDefaultAsync(d => d.Name.ToLower() == trimmed, ct);
    }

    public async Task<List<Destination>> SearchByInterestsAsync(string interest, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(interest))
        {
            return await GetAllAsync(ct);
        }

        var terms = interest.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                            .Select(t => t.Trim().ToLower())
                            .ToList();

        var all = await _context.Destinations
            .Include(d => d.Hotels)
            .Include(d => d.Activities)
            .ToListAsync(ct);

        return all.Where(d => terms.Any(t => d.Tags.ToLower().Contains(t) || d.Description.ToLower().Contains(t)))
                  .ToList();
    }
}
