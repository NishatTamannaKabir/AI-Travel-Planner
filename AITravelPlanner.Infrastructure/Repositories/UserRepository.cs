using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AITravelPlanner.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TravelDbContext _context;

    public UserRepository(TravelDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Users.FindAsync(new object[] { id }, ct);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.Trim().ToLower(), ct);
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
    {
        return await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email.Trim().ToLower(), ct);
    }

    public async Task AddAsync(User user, CancellationToken ct = default)
    {
        await _context.Users.AddAsync(user, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(User user, CancellationToken ct = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(ct);
    }
}
