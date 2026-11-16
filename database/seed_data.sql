-- =========================================================================
-- AI Travel Planner - Seed Data for Regional Indian Destinations
-- =========================================================================

USE [AITravelPlannerDb];
GO

-- 1. Insert Demo User (Password: Password123!)
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'demo@aitravelplanner.com')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, CreatedAt)
    VALUES ('Demo Explorer', 'demo@aitravelplanner.com', '$2a$11$B1w3lIqA5aZJ6rT2.e9u..9w5G3p8bI4F7A9C2D1E5F8G2H4I6J8K', SYSUTCDATETIME());
END
GO

-- 2. Insert Destinations
SET IDENTITY_INSERT dbo.Destinations ON;

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Darjeeling')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (1, 'Darjeeling', 'West Bengal', 'The Queen of the Hills, renowned for lush tea gardens, panoramic Himalayan views, and the UNESCO Himalayan Railway.', 'hills, nature, tea, cool weather, trekking', 6000.00, 3, 'October - May', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Puri')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (2, 'Puri', 'Odisha', 'Sacred coastal city famous for the Jagannath Temple, golden surf beaches, and delectable coastal seafood.', 'beach, temple, seafood, relaxation, spiritual', 3000.00, 3, 'October - March', 'https://images.unsplash.com/photo-1609137144822-2615bf850787?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Goa')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (3, 'Goa', 'Goa', 'Tropical coastal paradise known for vibrant sandy shores, Portuguese heritage architecture, and exhilarating nightlife.', 'beach, nightlife, food, water sports, adventure', 9000.00, 4, 'November - February', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Rishikesh')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (4, 'Rishikesh', 'Uttarakhand', 'Yoga Capital of the World along the emerald Ganges, famed for thrilling rapids, cliff jumping, and spiritual aarti.', 'adventure, rafting, yoga, spiritual, nature', 5000.00, 3, 'September - April', 'https://images.unsplash.com/photo-1600100397608-f010f443c0d8?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Jaipur')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (5, 'Jaipur', 'Rajasthan', 'The Pink City of Maharajas, adorned with majestic hill forts, royal palaces, bazaars, and vibrant Rajasthani feasts.', 'heritage, forts, food, shopping, culture', 5000.00, 3, 'October - March', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Coorg')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (6, 'Coorg', 'Karnataka', 'The Scotland of India, cloaked in aromatic coffee estates, spice valleys, and tumbling waterfalls.', 'hills, nature, coffee, waterfalls, relaxation', 6500.00, 3, 'October - April', 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80', SYSUTCDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM dbo.Destinations WHERE Name = 'Pondicherry')
BEGIN
    INSERT INTO dbo.Destinations (Id, Name, State, Description, Tags, TravelCostPerPerson, IdealDurationDays, BestSeason, ImageUrl, CreatedAt)
    VALUES (7, 'Pondicherry', 'Puducherry', 'French coastal enclave featuring cobblestone promenades, pastel colonial villas, yoga centers, and artisanal bistros.', 'beach, heritage, cafes, food, relaxation, spiritual', 6000.00, 3, 'October - March', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', SYSUTCDATETIME());
END

SET IDENTITY_INSERT dbo.Destinations OFF;
GO
