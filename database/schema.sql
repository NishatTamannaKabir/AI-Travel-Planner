-- =========================================================================
-- AI Travel Planner - SQL Server Database Schema (DDL)
-- Compatible with SQL Server 2019 / 2022 / 2025 / LocalDB
-- =========================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AITravelPlannerDb')
BEGIN
    CREATE DATABASE [AITravelPlannerDb];
END
GO

USE [AITravelPlannerDb];
GO

-- 1. Users Table
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Users_Email UNIQUE (Email)
    );
END
GO

-- 2. Destinations Table
IF OBJECT_ID('dbo.Destinations', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Destinations (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        State NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Tags NVARCHAR(MAX) NOT NULL,
        TravelCostPerPerson DECIMAL(18,2) NOT NULL,
        IdealDurationDays INT NOT NULL DEFAULT 3,
        BestSeason NVARCHAR(100) NOT NULL,
        ImageUrl NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Destinations_Name UNIQUE (Name)
    );
END
GO

-- 3. Hotels Table
IF OBJECT_ID('dbo.Hotels', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Hotels (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        DestinationId INT NOT NULL,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        PricePerNight DECIMAL(18,2) NOT NULL,
        Rating FLOAT NOT NULL DEFAULT 4.0,
        Amenities NVARCHAR(MAX) NOT NULL,
        Address NVARCHAR(MAX) NOT NULL,
        ImageUrl NVARCHAR(MAX) NOT NULL,
        CONSTRAINT FK_Hotels_Destinations FOREIGN KEY (DestinationId) REFERENCES dbo.Destinations(Id) ON DELETE CASCADE
    );
END
GO

-- 4. Activities Table
IF OBJECT_ID('dbo.Activities', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Activities (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        DestinationId INT NOT NULL,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        CostPerPerson DECIMAL(18,2) NOT NULL,
        TimeOfDay INT NOT NULL DEFAULT 0, -- 0: Morning, 1: Afternoon, 2: Evening, 3: FullDay
        Category NVARCHAR(100) NOT NULL,
        CONSTRAINT FK_Activities_Destinations FOREIGN KEY (DestinationId) REFERENCES dbo.Destinations(Id) ON DELETE CASCADE
    );
END
GO

-- 5. Trips Table
IF OBJECT_ID('dbo.Trips', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Trips (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        Title NVARCHAR(200) NOT NULL,
        OriginCity NVARCHAR(100) NOT NULL,
        DestinationName NVARCHAR(100) NOT NULL,
        DestinationId INT NULL,
        TotalBudget DECIMAL(18,2) NOT NULL,
        EstimatedTotalCost DECIMAL(18,2) NOT NULL,
        RemainingBudget DECIMAL(18,2) NOT NULL,
        Travellers INT NOT NULL DEFAULT 1,
        Nights INT NOT NULL DEFAULT 2,
        Days INT NOT NULL DEFAULT 3,
        Status INT NOT NULL DEFAULT 1, -- 0: Draft, 1: Planned, 2: Replanned, 3: Confirmed
        Interests NVARCHAR(MAX) NOT NULL,
        WeatherSummary NVARCHAR(MAX) NOT NULL,
        ChosenHotelName NVARCHAR(150) NOT NULL,
        ChosenHotelPricePerNight DECIMAL(18,2) NOT NULL,
        TravelCost DECIMAL(18,2) NOT NULL,
        HotelCost DECIMAL(18,2) NOT NULL,
        FoodCost DECIMAL(18,2) NOT NULL,
        ActivitiesCost DECIMAL(18,2) NOT NULL,
        MiscCost DECIMAL(18,2) NOT NULL,
        AiExplanation NVARCHAR(MAX) NOT NULL,
        PackingTip NVARCHAR(MAX) NOT NULL,
        ReplanNotes NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Trips_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE SET NULL,
        CONSTRAINT FK_Trips_Destinations FOREIGN KEY (DestinationId) REFERENCES dbo.Destinations(Id) ON DELETE SET NULL
    );
END
GO

-- 6. TripTravellers Table
IF OBJECT_ID('dbo.TripTravellers', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.TripTravellers (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TripId INT NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        Age INT NOT NULL DEFAULT 25,
        SpecialPreferences NVARCHAR(MAX) NOT NULL,
        CONSTRAINT FK_TripTravellers_Trips FOREIGN KEY (TripId) REFERENCES dbo.Trips(Id) ON DELETE CASCADE
    );
END
GO

-- 7. ItineraryDays Table
IF OBJECT_ID('dbo.ItineraryDays', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ItineraryDays (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TripId INT NOT NULL,
        DayNumber INT NOT NULL,
        DayName NVARCHAR(100) NOT NULL,
        MorningActivity NVARCHAR(MAX) NOT NULL,
        AfternoonActivity NVARCHAR(MAX) NOT NULL,
        EveningActivity NVARCHAR(MAX) NOT NULL,
        EstimatedDailyCost DECIMAL(18,2) NOT NULL,
        Notes NVARCHAR(MAX) NOT NULL,
        CONSTRAINT FK_ItineraryDays_Trips FOREIGN KEY (TripId) REFERENCES dbo.Trips(Id) ON DELETE CASCADE
    );
END
GO

-- 8. SavedPlans Table
IF OBJECT_ID('dbo.SavedPlans', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SavedPlans (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        TripId INT NOT NULL,
        PlanTitle NVARCHAR(200) NOT NULL,
        Notes NVARCHAR(MAX) NOT NULL,
        SavedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        PlanJson NVARCHAR(MAX) NOT NULL,
        CONSTRAINT FK_SavedPlans_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_SavedPlans_Trips FOREIGN KEY (TripId) REFERENCES dbo.Trips(Id) ON DELETE NO ACTION
    );
END
GO
