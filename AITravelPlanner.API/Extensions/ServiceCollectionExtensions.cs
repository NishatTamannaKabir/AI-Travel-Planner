using System;
using System.Text;
using AITravelPlanner.Application.Agents;
using AITravelPlanner.Application.Interfaces;
using AITravelPlanner.Application.Services;
using AITravelPlanner.Application.Tools;
using AITravelPlanner.Infrastructure.Configuration;
using AITravelPlanner.Infrastructure.Data;
using AITravelPlanner.Infrastructure.ExternalServices;
using AITravelPlanner.Infrastructure.Repositories;
using AITravelPlanner.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace AITravelPlanner.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Server=(localdb)\\mssqllocaldb;Database=AITravelPlannerDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

        services.AddDbContext<TravelDbContext>(options =>
            options.UseSqlServer(connectionString, sql =>
                sql.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null)));

        // Options
        services.Configure<OllamaOptions>(configuration.GetSection(OllamaOptions.SectionName));
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<WeatherOptions>(configuration.GetSection(WeatherOptions.SectionName));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDestinationRepository, DestinationRepository>();
        services.AddScoped<IHotelRepository, HotelRepository>();
        services.AddScoped<ITripRepository, TripRepository>();

        // Security
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        // External & Domain Services
        services.AddScoped<IWeatherService, MockWeatherService>();
        services.AddHttpClient<IAIService, OllamaService>();
        services.AddScoped<IBudgetService, BudgetService>();
        services.AddScoped<IReplanningService, ReplanningService>();
        services.AddScoped<ITravelPlanningService, TravelPlanningService>();

        // AI Tools & Agent
        services.AddScoped<TravelTools>();
        services.AddScoped<TravelPlannerAgent>();

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        var secretKey = jwtSection["SecretKey"] ?? "AI_Travel_Planner_Super_Secret_Key_For_JWT_Authentication_2026";
        var issuer = jwtSection["Issuer"] ?? "AITravelPlannerAPI";
        var audience = jwtSection["Audience"] ?? "AITravelPlannerWeb";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }

    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "AI Travel Planner API",
                Version = "v1",
                Description = "Production-grade RESTful API for AI Travel Planner with Agent Framework, Ollama LLM, and Dynamic Replanning.",
                Contact = new OpenApiContact
                {
                    Name = "AI Travel Planner Team",
                    Email = "support@aitravelplanner.com"
                }
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}
