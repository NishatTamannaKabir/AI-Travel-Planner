using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Common;
using AITravelPlanner.Infrastructure.Configuration;
using AITravelPlanner.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AITravelPlanner.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly TravelDbContext _dbContext;
    private readonly OllamaOptions _ollamaOptions;
    private readonly HttpClient _httpClient;

    public HealthController(
        TravelDbContext dbContext,
        IOptions<OllamaOptions> ollamaOptions,
        HttpClient httpClient)
    {
        _dbContext = dbContext;
        _ollamaOptions = ollamaOptions.Value;
        _httpClient = httpClient;
    }

    [HttpGet]
    public async Task<IActionResult> CheckHealth(CancellationToken ct)
    {
        bool dbHealthy = false;
        string dbMessage = "Connected";
        try
        {
            dbHealthy = await _dbContext.Database.CanConnectAsync(ct);
        }
        catch (Exception ex)
        {
            dbMessage = ex.Message;
        }

        bool ollamaHealthy = false;
        string ollamaMessage = "Offline";
        try
        {
            _httpClient.Timeout = TimeSpan.FromSeconds(3);
            var response = await _httpClient.GetAsync($"{_ollamaOptions.Endpoint}/api/tags", ct);
            ollamaHealthy = response.IsSuccessStatusCode;
            ollamaMessage = ollamaHealthy ? "Connected" : $"Http {(int)response.StatusCode}";
        }
        catch (Exception ex)
        {
            ollamaMessage = $"Unavailable: {ex.Message}";
        }

        var healthData = new
        {
            Status = dbHealthy ? "Healthy" : "Degraded",
            Timestamp = DateTime.UtcNow,
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
            Framework = ".NET 10.0",
            Database = new
            {
                Provider = "SQL Server",
                Status = dbHealthy ? "Healthy" : "Unhealthy",
                Message = dbMessage
            },
            AI = new
            {
                Provider = "Ollama",
                Endpoint = _ollamaOptions.Endpoint,
                Model = _ollamaOptions.ChatModel,
                Status = ollamaHealthy ? "Online" : "Offline (Fallback Active)",
                Message = ollamaMessage
            },
            Weather = new
            {
                Provider = "Regional Mock Service (Swappable)",
                Status = "Healthy"
            }
        };

        return Ok(ApiResponse<object>.Ok(healthData, "System health status retrieved."));
    }
}
