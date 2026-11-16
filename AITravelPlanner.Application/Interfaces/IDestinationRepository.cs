using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Domain.Entities;

namespace AITravelPlanner.Application.Interfaces;

public interface IDestinationRepository
{
    Task<List<Destination>> GetAllAsync(CancellationToken ct = default);
    Task<Destination?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Destination?> GetByNameAsync(string name, CancellationToken ct = default);
    Task<List<Destination>> SearchByInterestsAsync(string interest, CancellationToken ct = default);
}
