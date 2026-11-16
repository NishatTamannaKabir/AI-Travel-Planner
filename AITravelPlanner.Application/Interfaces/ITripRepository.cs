using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Domain.Entities;

namespace AITravelPlanner.Application.Interfaces;

public interface ITripRepository
{
    Task<Trip?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Trip?> GetByIdWithDetailsAsync(int id, CancellationToken ct = default);
    Task<List<Trip>> GetByUserIdAsync(int userId, CancellationToken ct = default);
    Task AddAsync(Trip trip, CancellationToken ct = default);
    Task UpdateAsync(Trip trip, CancellationToken ct = default);
    Task DeleteAsync(Trip trip, CancellationToken ct = default);
    Task<SavedPlan?> GetSavedPlanAsync(int tripId, int userId, CancellationToken ct = default);
    Task SavePlanAsync(SavedPlan savedPlan, CancellationToken ct = default);
}
