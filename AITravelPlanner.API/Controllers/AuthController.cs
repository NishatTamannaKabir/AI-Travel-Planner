using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Auth;
using AITravelPlanner.Application.DTOs.Common;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AITravelPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        ILogger<AuthController> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Validation failed"));
        }

        if (await _userRepository.EmailExistsAsync(request.Email, ct))
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("An account with this email already exists."));
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLower(),
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            CreatedAt = System.DateTime.UtcNow
        };

        await _userRepository.AddAsync(user, ct);
        _logger.LogInformation("New user registered successfully: {Email}", user.Email);

        var token = _jwtTokenService.GenerateToken(user);
        var authResponse = new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            },
            ExpiresAt = System.DateTime.UtcNow.AddHours(24)
        };

        return Ok(ApiResponse<AuthResponse>.Ok(authResponse, "Registration successful. Welcome to AI Travel Planner!"));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<AuthResponse>.Fail("Validation failed"));
        }

        var user = await _userRepository.GetByEmailAsync(request.Email, ct);
        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
            return Unauthorized(ApiResponse<AuthResponse>.Fail("Invalid email or password."));
        }

        _logger.LogInformation("User logged in successfully: {Email}", user.Email);
        var token = _jwtTokenService.GenerateToken(user);
        var authResponse = new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            },
            ExpiresAt = System.DateTime.UtcNow.AddHours(24)
        };

        return Ok(ApiResponse<AuthResponse>.Ok(authResponse, "Login successful."));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser(CancellationToken ct)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out int userId))
        {
            return Unauthorized(ApiResponse<UserDto>.Fail("Unauthorized"));
        }

        var user = await _userRepository.GetByIdAsync(userId, ct);
        if (user == null)
        {
            return NotFound(ApiResponse<UserDto>.Fail("User not found."));
        }

        return Ok(ApiResponse<UserDto>.Ok(new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        }));
    }
}
