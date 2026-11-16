using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;
using AITravelPlanner.Application.Interfaces;

namespace AITravelPlanner.Infrastructure.ExternalServices;

/// <summary>
/// Sample/Development weather provider simulating regional Indian seasonal weather.
/// Structured so a live weather API (e.g. OpenWeatherMap, WeatherAPI) can be injected cleanly.
/// Note: This is an architectural simulation for local development and offline resilience.
/// </summary>
public class MockWeatherService : IWeatherService
{
    private static readonly Dictionary<string, (string Condition, int Temp, string Detailed, bool HeavyRain)> RegionalForecasts =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Darjeeling"] = ("Cool & Misty", 15, "Saturday: Cloudy 14 °C, Sunday: Sunny 16 °C. Light mountain mist in the morning.", false),
            ["Puri"] = ("Sunny & Pleasant", 31, "Saturday: Sunny 31 °C, Sunday: Sunny 32 °C with gentle coastal breeze.", false),
            ["Goa"] = ("Heavy Monsoon Showers", 26, "Saturday: Heavy rain 26 °C, Sunday: Torrential downpour 27 °C. Rough sea conditions.", true),
            ["Rishikesh"] = ("Clear & Crisp", 29, "Saturday: Sunny 29 °C, Sunday: Partly cloudy 28 °C. Ideal for rafting.", false),
            ["Jaipur"] = ("Warm & Dry", 35, "Saturday: Hot and sunny 36 °C, Sunday: Sunny 35 °C with clear blue skies.", false),
            ["Coorg"] = ("Gentle Drizzle", 21, "Saturday: Light drizzle 21 °C, Sunday: Overcast and breezy 22 °C.", false),
            ["Pondicherry"] = ("Sunny Coastal", 30, "Saturday: Sunny 30 °C, Sunday: Partly cloudy 29 °C with mild evening breeze.", false),
            ["Munnar"] = ("Cool Tea Valleys", 18, "Saturday: Misty 17 °C, Sunday: Crisp sunshine 19 °C.", false),
            ["Udaipur"] = ("Lake Breeze Sunny", 32, "Saturday: Clear skies 33 °C, Sunday: Sunny 31 °C.", false),
            ["Manali"] = ("Chilly Mountain Air", 12, "Saturday: Crisp & cool 11 °C, Sunday: Bright sunshine 13 °C.", false)
        };

    public Task<WeatherForecastDto> GetWeatherForecastAsync(string destination, CancellationToken ct = default)
    {
        string destName = destination.Trim();
        if (RegionalForecasts.TryGetValue(destName, out var info))
        {
            return Task.FromResult(new WeatherForecastDto
            {
                Destination = destName,
                Condition = info.Condition,
                TemperatureCelsius = info.Temp,
                Description = $"Simulated regional forecast for {destName}. {info.Detailed}",
                HasHeavyRain = info.HeavyRain,
                DetailedForecast = info.Detailed
            });
        }

        // Generic fallback for any destination
        return Task.FromResult(new WeatherForecastDto
        {
            Destination = destName,
            Condition = "Pleasant",
            TemperatureCelsius = 25,
            Description = $"Moderate conditions expected across {destName}.",
            HasHeavyRain = false,
            DetailedForecast = "Saturday: Partly cloudy 25 °C, Sunday: Sunny 27 °C with comfortable travel conditions."
        });
    }

    public async Task<Dictionary<string, WeatherForecastDto>> GetDestinationsWeatherAsync(
        IEnumerable<string> destinations, CancellationToken ct = default)
    {
        var result = new Dictionary<string, WeatherForecastDto>(StringComparer.OrdinalIgnoreCase);
        foreach (var dest in destinations)
        {
            result[dest] = await GetWeatherForecastAsync(dest, ct);
        }
        return result;
    }
}
