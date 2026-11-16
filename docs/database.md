# AI Travel Planner - Database Design

## Entity Relationship Overview

The database is built on SQL Server 2025 using Entity Framework Core with Code-First migrations and automated startup seeding.

```text
       +--------------------+
       |       Users        |
       |--------------------|
       | Id (PK)            |
       | FullName           |
       | Email (Unique)     |
       | PasswordHash       |
       | CreatedAt          |
       +--------------------+
                 |
                 | 1:N
                 v
       +--------------------+          +--------------------+
       |       Trips        |--------->|    SavedPlans      |
       |--------------------| 1:N      |--------------------|
       | Id (PK)            |          | Id (PK)            |
       | UserId (FK, Null)  |          | UserId (FK)        |
       | Title              |          | TripId (FK)        |
       | OriginCity         |          | PlanJson           |
       | DestinationName    |          | SavedAt            |
       | DestinationId (FK) |          +--------------------+
       | TotalBudget        |
       | EstimatedTotalCost |
       | RemainingBudget    |
       | Travellers         |
       | Nights, Days       |
       | TravelCost         |
       | HotelCost          |
       | FoodCost           |
       | ActivitiesCost     |
       | MiscCost           |
       | Status             |
       +--------------------+
                 |
        +--------+--------+
        |                 |
        v 1:N             v 1:N
+---------------+  +------------------+
| ItineraryDays |  |  TripTravellers  |
|---------------|  |------------------|
| Id (PK)       |  | Id (PK)          |
| TripId (FK)   |  | TripId (FK)      |
| DayNumber     |  | Name             |
| DayName       |  | Age              |
| Morning       |  | Preferences      |
| Afternoon     |  +------------------+
| Evening       |
| DailyCost     |
+---------------+

+-------------------+          +-------------------+
|   Destinations    | 1:N      |      Hotels       |
|-------------------|--------->|-------------------|
| Id (PK)           |          | Id (PK)           |
| Name (Unique)     |          | DestinationId (FK)|
| State             |          | Name              |
| TravelCostPerPax  |          | PricePerNight     |
| Tags              |          | Rating            |
| ImageUrl          |          | Amenities         |
+-------------------+          +-------------------+
        |
        | 1:N
        v
+-------------------+
|    Activities     |
|-------------------|
| Id (PK)           |
| DestinationId (FK)|
| Name              |
| CostPerPerson     |
| TimeOfDay         |
+-------------------+
```

## Schema Normalization & Performance
1. **Decimal Precision**: All currency and financial figures (`TotalBudget`, `EstimatedTotalCost`, `PricePerNight`, `TravelCost`, etc.) use `DECIMAL(18,2)` to eliminate floating-point rounding errors.
2. **Cascading Referential Integrity**: Deleting a trip cascades to its `ItineraryDays` and `TripTravellers`.
3. **Indexes**: Unique index on `Users.Email` and `Destinations.Name`.
4. **Resilient LocalDB Seeding**: `SeedData.cs` verifies table existence and populates rich initial catalog data on startup without requiring manual SQL file execution.
