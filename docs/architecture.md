# AI Travel Planner - Architecture Documentation

## Overview

AI Travel Planner is a full-stack, enterprise-grade travel recommendation and autonomous replanning system designed using Clean Architecture principles, Microsoft Agent Framework, ASP.NET Core Web API on .NET 10, Entity Framework Core with SQL Server, and local LLM inference via Ollama (Llama 3.2).

## High-Level System Architecture

```text
+-----------------------------------------------------------------------+
|                         React + TypeScript Frontend                   |
|           Tailwind CSS • Lucide Icons • Responsive SaaS UI            |
+-----------------------------------------------------------------------+
                                   |
                             (REST / JSON)
                                   v
+-----------------------------------------------------------------------+
|                    ASP.NET Core Web API (.NET 10)                     |
|  Controllers • Exception Middleware • JWT Bearer Auth • Swagger OpenAPI|
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                       Application Layer (Use Cases)                   |
|  TravelPlanningService • BudgetService • ReplanningService            |
|  DTOs • Interfaces • TravelTools • TravelPlannerAgent                  |
+-----------------------------------------------------------------------+
              |                                          |
              v                                          v
+----------------------------+             +----------------------------+
|  Domain Layer (Entities)   |             |   Infrastructure Layer     |
|  Trip, Destination, Hotel  |             |   EF Core DbContext        |
|  Activity, ItineraryDay    |             |   Repositories             |
|  User, SavedPlan, Enums    |             |   JwtTokenService & BCrypt |
+----------------------------+             |   MockWeatherService       |
                                           |   OllamaService (Llama 3.2)|
                                           +----------------------------+
                                                    |            |
                                       +------------+            +------------+
                                       v                                      v
                             +-------------------+                  +-------------------+
                             |  Local Ollama LLM |                  |     SQL Server    |
                             |   (Port 11434)    |                  | (AITravelPlannerDb|
                             +-------------------+                  +-------------------+
```

## Clean Architecture Principles

1. **Domain Layer (`AITravelPlanner.Domain`)**:
   - Zero external infrastructure or framework dependencies.
   - Encapsulates entities, domain rules, and domain enums.
   - Pure C# classes representing business concepts: `User`, `Trip`, `Destination`, `Hotel`, `Activity`, `ItineraryDay`, `SavedPlan`.

2. **Application Layer (`AITravelPlanner.Application`)**:
   - Contains business logic, DTOs, service abstractions, and AI tool definitions.
   - Depends only on Domain.
   - Contains the core **Replanning Engine** (`ReplanningService`), **Budget Engine** (`BudgetService`), and **Travel Planning Orchestrator** (`TravelPlanningService`).
   - Declares Microsoft Agent Framework function definitions (`TravelTools`).

3. **Infrastructure Layer (`AITravelPlanner.Infrastructure`)**:
   - Implements repositories, external integrations, data access, and security services.
   - EF Core `TravelDbContext` mapping with fluent configurations and decimal precisions.
   - `OllamaService` implementing `IAIService` with resilient fallback parsing.
   - `MockWeatherService` implementing `IWeatherService` with weather conditions and monsoons.
   - `PasswordHasher` using salted BCrypt and `JwtTokenService` using HMAC-SHA256.

4. **API Layer (`AITravelPlanner.API`)**:
   - Thin ASP.NET Core controllers handling HTTP requests and response serialization.
   - Global `ExceptionHandlingMiddleware` formatting standard `ApiResponse<T>` errors.
   - JWT authentication and Swagger/OpenAPI documentation.
