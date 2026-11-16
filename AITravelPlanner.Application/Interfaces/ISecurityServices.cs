using AITravelPlanner.Domain.Entities;

namespace AITravelPlanner.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    int? ValidateTokenAndGetUserId(string token);
}

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
