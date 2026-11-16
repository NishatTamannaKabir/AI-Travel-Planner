# AI Travel Planner - AI Workflow & Replanning Architecture

## End-to-End Planning Lifecycle

```text
User Natural Language Request
      |
      v
[1. AI Constraint Extraction]
      |  Extracts: Origin, Destination, Budget, Travellers, Nights, Interests, Weather
      v
[2. Destination Recommendation]
      |  Tool: SearchDestinations(interest)
      |  Filters catalog based on tags and transit expenditures
      v
[3. Live Weather Verification]
      |  Tool: GetWeatherForecast(destination)
      |  Applies weather constraints (e.g., skips Goa if heavy monsoon rain is forecasted)
      v
[4. Hotel Selection & Filtering]
      |  Tool: SearchHotels(destination, maxPricePerNight)
      |  Calculates max permissible room night cost = (Budget - NonHotelCosts) / Nights
      v
[5. Multi-Category Budget Engine]
      |  Tool: CalculateBudget(...)
      |  Travel: travelCostPerPerson * travellers
      |  Hotel: hotelPricePerNight * nights * ceil(travellers/2)
      |  Food & Dining: 1,500 * travellers * days
      |  Activities: activityCost * travellers
      |  Buffer / Misc: 5% safety margin
      v
[6. Autonomous Replanning Decision Gate]
     / \
    /   \  Within Budget?
   / YES \---------------------> Proceed to Itinerary
   \     /
    \   /  NO (Over Budget)
     \ /
      |
      v
+--------------------------------------------------------------+
|               AUTONOMOUS REPLANNING ENGINE                    |
|                                                              |
| Level 1: Downgrade Hotel in Same Destination                 |
|   - Queries lower-priced hotels (e.g. Budget Inn vs Resort)   |
|   - Re-runs CalculateBudget                                  |
|                                                              |
| Level 2: Alternate Sibling Destination                       |
|   - If still over budget, searches alternative destination   |
|     with lower travel costs (e.g. Puri vs Goa)               |
|                                                              |
| Level 3: Optimize Activity & Dining Allowance                |
|   - Trims discretionary tour packages                        |
|                                                              |
| Formulates Human Explanation:                                |
|   "Your original plan exceeded the budget by ₹4,500,         |
|    so I selected a lower-cost hotel and adjusted itinerary."  |
+--------------------------------------------------------------+
      |
      v
[7. Day-by-Day Curated Itinerary Generation]
      |  Morning, Afternoon, Evening schedule tailored to destination & weather
      v
[8. Weather-Specific Packing Tips]
      |  e.g., UV sunglasses & sunscreen for beaches; woolens for Darjeeling
      v
[9. Persistence in SQL Server]
      |  Saved to Trips & ItineraryDays tables with User ID mapping
```

## AI Tool Implementation Details

Tools are exposed via `TravelTools.cs` and declared to Microsoft Agent Framework using `Microsoft.Extensions.AI.AIFunctionFactory.Create`:

```csharp
[Description("Finds destinations matching user interests with travel costs.")]
public async Task<string> SearchDestinationsAsync(string interest);

[Description("Gets the weather forecast for a destination to ensure favorable conditions.")]
public async Task<string> GetWeatherForecastAsync(string destination);

[Description("Searches for hotels in a specific destination within maximum nightly price.")]
public async Task<string> SearchHotelsAsync(string destination, decimal maxPricePerNight);

[Description("Calculates comprehensive travel budget breakdown and returns feasibility verdict.")]
public string CalculateBudget(decimal travelCost, decimal hotelPrice, int nights, int travellers, decimal totalBudget);
```

Small, focused steps allow local lightweight models such as Llama 3.2 to reason reliably without context hallucinations.
