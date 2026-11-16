using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Domain.Enums;
using AITravelPlanner.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AITravelPlanner.Infrastructure.Repositories;

public class TripRepository : ITripRepository
{
    private readonly TravelDbContext _context;

    public TripRepository(TravelDbContext context)
    {
        _context = context;
    }

    public async Task<Trip?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Trips.FindAsync(new object[] { id }, ct);
    }

    public async Task<Trip?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _context.Trips
            .AsSplitQuery()
            .Include(t => t.Destination)
                .ThenInclude(d => d!.Hotels)
            .Include(t => t.Destination)
                .ThenInclude(d => d!.Activities)
            .Include(t => t.ItineraryDays)
            .Include(t => t.TravellersList)
            .Include(t => t.SavedPlans)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<List<Trip>> GetByUserIdAsync(int userId, CancellationToken ct = default)
    {
        return await _context.Trips
            .Where(t => t.UserId == userId && (t.Status == TripStatus.Confirmed || _context.SavedPlans.Any(s => s.TripId == t.Id && s.UserId == userId)))
            .Include(t => t.ItineraryDays)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task AddAsync(Trip trip, CancellationToken ct = default)
    {
        await _context.Trips.AddAsync(trip, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Trip trip, CancellationToken ct = default)
    {
        _context.Trips.Update(trip);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Trip trip, CancellationToken ct = default)
    {
        var savedPlans = await _context.SavedPlans
            .Where(s => s.TripId == trip.Id)
            .ToListAsync(ct);

        if (savedPlans.Count > 0)
        {
            _context.SavedPlans.RemoveRange(savedPlans);
        }

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync(ct);
    }

    public async Task<SavedPlan?> GetSavedPlanAsync(int tripId, int userId, CancellationToken ct = default)
    {
        return await _context.SavedPlans
            .FirstOrDefaultAsync(s => s.TripId == tripId && s.UserId == userId, ct);
    }

    public async Task SavePlanAsync(SavedPlan savedPlan, CancellationToken ct = default)
    {
        await _context.SavedPlans.AddAsync(savedPlan, ct);
        await _context.SaveChangesAsync(ct);
    }
}
