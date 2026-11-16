namespace AITravelPlanner.Infrastructure.Configuration;

public class OllamaOptions
{
    public const string SectionName = "Ollama";

    public string Endpoint { get; set; } = "http://localhost:11434";
    public string ChatModel { get; set; } = "llama3.2";
    public string EmbeddingModel { get; set; } = "nomic-embed-text";
    public int TimeoutSeconds { get; set; } = 60;
}

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string SecretKey { get; set; } = "AI_Travel_Planner_Super_Secret_Key_For_JWT_Authentication_2026";
    public string Issuer { get; set; } = "AITravelPlannerAPI";
    public string Audience { get; set; } = "AITravelPlannerWeb";
    public int ExpirationHours { get; set; } = 24;
}

public class WeatherOptions
{
    public const string SectionName = "Weather";

    public string Provider { get; set; } = "Mock"; // "Mock" or "OpenWeatherMap"
    public string ApiKey { get; set; } = string.Empty;
}
