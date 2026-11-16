using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AITravelPlanner.Application.DTOs.Destinations;

namespace AITravelPlanner.Application.Interfaces;

public interface IWeatherService
{
    Task<WeatherForecastDto> GetWeatherForecastAsync(string destination, CancellationToken ct = default);
    Task<Dictionary<string, WeatherForecastDto>> GetDestinationsWeatherAsync(IEnumerable<string> destinations, CancellationToken ct = default);
}
