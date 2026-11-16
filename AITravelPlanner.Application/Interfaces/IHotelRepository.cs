using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Domain.Entities;

namespace AITravelPlanner.Application.Interfaces;

public interface IHotelRepository
{
    Task<List<Hotel>> GetAllAsync(CancellationToken ct = default);
    Task<Hotel?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<List<Hotel>> GetByDestinationAsync(string destinationName, decimal? maxPrice = null, CancellationToken ct = default);
}
