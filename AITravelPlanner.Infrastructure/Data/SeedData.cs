using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace AITravelPlanner.Infrastructure.Data;

public static class SeedData
{
    public static async Task InitializeAsync(TravelDbContext context)
    {
        // Apply migrations automatically if needed
        await context.Database.EnsureCreatedAsync();

        if (await context.Destinations.AnyAsync())
        {
            return; // DB has already been seeded
        }

        // 1. Seed Demo User
        var demoUser = new User
        {
            FullName = "Demo Explorer",
            Email = "demo@aitravelplanner.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            CreatedAt = DateTime.UtcNow
        };
        await context.Users.AddAsync(demoUser);

        // 2. Seed Destinations with Hotels and Activities
        var destinations = new List<Destination>
        {
            new Destination
            {
                Name = "Darjeeling",
                State = "West Bengal",
                Description = "The Queen of the Hills, renowned for lush tea gardens, panoramic Himalayan views, and the UNESCO Himalayan Railway.",
                Tags = "hills, nature, tea, cool weather, trekking",
                TravelCostPerPerson = 6000,
                IdealDurationDays = 3,
                BestSeason = "October - May",
                ImageUrl = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Tea Garden Retreat", Description = "Colonial charm amidst misty tea terraces with mountain view dining.", PricePerNight = 3500, Rating = 4.5, Amenities = "Free WiFi, Breakfast, Mountain View, Fireplace", Address = "Lebong Cart Rd, Darjeeling" },
                    new Hotel { Name = "Mall Road Budget Inn", Description = "Cozy and convenient stay just walking steps from Chowrasta Mall.", PricePerNight = 1500, Rating = 3.9, Amenities = "Free WiFi, Hot Water, Room Service", Address = "Mall Road, Darjeeling" },
                    new Hotel { Name = "Windamere Heritage Hotel", Description = "Historic luxury hotel offering high tea and panoramic valley views.", PricePerNight = 6500, Rating = 4.8, Amenities = "Luxury Suites, Fine Dining, Spa, WiFi", Address = "Observatory Hill, Darjeeling" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Tiger Hill Sunrise & Batasia Loop", Description = "Witness golden sunrise over Mount Kanchenjunga followed by Batasia Loop war memorial.", CostPerPerson = 600, TimeOfDay = TimeOfDay.Morning, Category = "Sightseeing" },
                    new Activity { Name = "Happy Valley Tea Estate Tour", Description = "Guided tea plucking tour and artisanal tasting session in pristine tea fields.", CostPerPerson = 400, TimeOfDay = TimeOfDay.Afternoon, Category = "Food" },
                    new Activity { Name = "Chowrasta Mall Evening Stroll & Bakery", Description = "Sample fresh hot chocolate and pastries at Glenary's while enjoying local street musicians.", CostPerPerson = 500, TimeOfDay = TimeOfDay.Evening, Category = "Relaxation" }
                }
            },
            new Destination
            {
                Name = "Puri",
                State = "Odisha",
                Description = "Sacred coastal city famous for the Jagannath Temple, golden surf beaches, and delectable coastal seafood.",
                Tags = "beach, temple, seafood, relaxation, spiritual",
                TravelCostPerPerson = 3000,
                IdealDurationDays = 3,
                BestSeason = "October - March",
                ImageUrl = "https://images.unsplash.com/photo-1609137144822-2615bf850787?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Sea Breeze Puri", Description = "Comfortable beachfront hotel with direct beach access and seafood grill.", PricePerNight = 2000, Rating = 4.1, Amenities = "Beachfront, Free WiFi, Restaurant, AC", Address = "Chakratirtha Road, Puri" },
                    new Hotel { Name = "Golden Beach Resort", Description = "Upscale luxury beach resort with private beach section and pool.", PricePerNight = 4500, Rating = 4.6, Amenities = "Private Beach, Swimming Pool, Multi-cuisine Restaurant, Spa", Address = "Marine Drive, Puri" },
                    new Hotel { Name = "Jagannath Dham Guest House", Description = "Affordable budget lodge close to the grand temple complex.", PricePerNight = 1100, Rating = 3.8, Amenities = "Hot Water, Pure Veg Kitchen, 24/7 Desk", Address = "Grand Road, Puri" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Jagannath Temple Darshan", Description = "Morning spiritual visit to the 12th-century Jagannath Temple followed by Mahaprasad tasting.", CostPerPerson = 200, TimeOfDay = TimeOfDay.Morning, Category = "Spiritual" },
                    new Activity { Name = "Golden Beach Relax & Watersports", Description = "Sunbathing, quad biking, and fresh tender coconut on the Blue Flag certified beach.", CostPerPerson = 500, TimeOfDay = TimeOfDay.Afternoon, Category = "Relaxation" },
                    new Activity { Name = "Marine Drive Seafood Trail", Description = "Tasting fresh grilled pomfret, prawn curry, and traditional Chhena Poda dessert.", CostPerPerson = 600, TimeOfDay = TimeOfDay.Evening, Category = "Food" }
                }
            },
            new Destination
            {
                Name = "Goa",
                State = "Goa",
                Description = "Tropical coastal paradise known for vibrant sandy shores, Portuguese heritage architecture, and exhilarating nightlife.",
                Tags = "beach, nightlife, food, water sports, adventure",
                TravelCostPerPerson = 9000,
                IdealDurationDays = 4,
                BestSeason = "November - February",
                ImageUrl = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Baga Beach Hostel", Description = "Energetic budget backpacker lodge with social vibe, cafe and bike rentals.", PricePerNight = 1200, Rating = 4.0, Amenities = "Free WiFi, Cafe, Bike Rental, Common Lounge", Address = "Tito's Lane, Baga" },
                    new Hotel { Name = "Candolim Palms", Description = "Serene boutique resort with landscaped tropical gardens and pool.", PricePerNight = 5500, Rating = 4.4, Amenities = "Pool, Bar, Free Breakfast, Balcony Rooms", Address = "Fort Aguada Rd, Candolim" },
                    new Hotel { Name = "Taj Fort Aguada Resort", Description = "Iconic 5-star seaside luxury perched above historic 16th-century ramparts.", PricePerNight = 12000, Rating = 4.9, Amenities = "Infinity Pool, Private Cabanas, World-class Dining, Spa", Address = "Sinquerim, Candolim" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Scuba Diving & Watersports Combo", Description = "Jet skiing, parasailing, and coral reef scuba diving at Grande Island.", CostPerPerson = 2200, TimeOfDay = TimeOfDay.Morning, Category = "Adventure" },
                    new Activity { Name = "Fontainhas Latin Quarter Walking Tour", Description = "Explore colorful heritage Portuguese villas, art galleries, and bakeries in Panaji.", CostPerPerson = 450, TimeOfDay = TimeOfDay.Afternoon, Category = "Heritage" },
                    new Activity { Name = "Anjuna Beach Sunset & Live Music", Description = "Watch sunset with beach shacks, acoustic music, and authentic Goan fish curry.", CostPerPerson = 800, TimeOfDay = TimeOfDay.Evening, Category = "Food" }
                }
            },
            new Destination
            {
                Name = "Rishikesh",
                State = "Uttarakhand",
                Description = "Yoga Capital of the World along the emerald Ganges, famed for thrilling rapids, cliff jumping, and spiritual aarti.",
                Tags = "adventure, rafting, yoga, spiritual, nature",
                TravelCostPerPerson = 5000,
                IdealDurationDays = 3,
                BestSeason = "September - April",
                ImageUrl = "https://images.unsplash.com/photo-1600100397608-f010f443c0d8?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Yoga Valley Stay", Description = "Peaceful riverside ashram stay with daily morning meditation sessions.", PricePerNight = 1400, Rating = 4.0, Amenities = "Yoga Hall, Pure Veg Cafe, River View, WiFi", Address = "Tapovan, Rishikesh" },
                    new Hotel { Name = "Ganga View Camp", Description = "Adventure riverside glamping with bonfire, stargazing, and volleyball.", PricePerNight = 2500, Rating = 4.3, Amenities = "Swiss Tents, Bonfire, All Meals, Riverbank Access", Address = "Shivpuri, Rishikesh" },
                    new Hotel { Name = "Aloha On The Ganges", Description = "Luxury resort overlooking the sacred river surrounded by forested hills.", PricePerNight = 7000, Rating = 4.7, Amenities = "Infinity Pool, Spa, River Terrace Dining, WiFi", Address = "Tapovan, Rishikesh" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "16km White Water River Rafting", Description = "Navigate grade III and IV rapids like Roller Coaster and Golf Course with cliff jumping.", CostPerPerson = 1200, TimeOfDay = TimeOfDay.Morning, Category = "Adventure" },
                    new Activity { Name = "Neer Garh Waterfall Hike", Description = "Scenic trek through canopy forests to tranquil cascading natural pools.", CostPerPerson = 300, TimeOfDay = TimeOfDay.Afternoon, Category = "Nature" },
                    new Activity { Name = "Triveni Ghat Evening Ganga Aarti", Description = "Mesmerizing spiritual prayer ceremony with brass lamps and devotional chants by the river.", CostPerPerson = 100, TimeOfDay = TimeOfDay.Evening, Category = "Spiritual" }
                }
            },
            new Destination
            {
                Name = "Jaipur",
                State = "Rajasthan",
                Description = "The Pink City of Maharajas, adorned with majestic hill forts, royal palaces, bazaars, and vibrant Rajasthani feasts.",
                Tags = "heritage, forts, food, shopping, culture",
                TravelCostPerPerson = 5000,
                IdealDurationDays = 3,
                BestSeason = "October - March",
                ImageUrl = "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Hawa Mahal Lodge", Description = "Budget-friendly traditional lodge in the old walled pink city.", PricePerNight = 1600, Rating = 3.8, Amenities = "Free WiFi, Rooftop Cafe, AC, Travel Desk", Address = "Badi Chaupar, Jaipur" },
                    new Hotel { Name = "Pink City Haveli", Description = "Heritage haveli with carved archways, courtyard folk dances, and thali dining.", PricePerNight = 3000, Rating = 4.5, Amenities = "Courtyard, Rajasthani Restaurant, Folk Shows, WiFi", Address = "Bani Park, Jaipur" },
                    new Hotel { Name = "Samode Haveli Luxury Stay", Description = "400-year-old restored royal residence featuring hand-painted frescos and pool.", PricePerNight = 8500, Rating = 4.8, Amenities = "Royal Suites, Pool, Spa, Candlelight Dining", Address = "Gangapole, Jaipur" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Amer Fort & Sheesh Mahal Exploration", Description = "Discover the formidable hilltop fortress with its breathtaking hall of mirrors.", CostPerPerson = 500, TimeOfDay = TimeOfDay.Morning, Category = "Heritage" },
                    new Activity { Name = "City Palace & Jantar Mantar Observatory", Description = "Tour royal courtyards and the UNESCO astronomical instruments.", CostPerPerson = 450, TimeOfDay = TimeOfDay.Afternoon, Category = "Heritage" },
                    new Activity { Name = "Chokhi Dhani Royal Rajasthani Feast", Description = "Authentic village resort with puppet shows, camel rides, and grand Dal Baati Churma feast.", CostPerPerson = 1100, TimeOfDay = TimeOfDay.Evening, Category = "Food" }
                }
            },
            new Destination
            {
                Name = "Coorg",
                State = "Karnataka",
                Description = "The Scotland of India, cloaked in aromatic coffee estates, spice valleys, and tumbling waterfalls.",
                Tags = "hills, nature, coffee, waterfalls, relaxation",
                TravelCostPerPerson = 6500,
                IdealDurationDays = 3,
                BestSeason = "October - April",
                ImageUrl = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Misty Hills Homestay", Description = "Authentic Kodava family homestay serving home-cooked Pandi curry and filter coffee.", PricePerNight = 1800, Rating = 4.2, Amenities = "Home-cooked Meals, Estate Walk, Hot Water, WiFi", Address = "Madikeri, Coorg" },
                    new Hotel { Name = "Coffee Estate Villa", Description = "Charming plantation cottage nested directly inside 50 acres of Arabica coffee.", PricePerNight = 4000, Rating = 4.7, Amenities = "Plantation Tours, Campfire, Restaurant, Balcony", Address = "Suntikoppa, Coorg" },
                    new Hotel { Name = "The Tamara Luxury Sanctuary", Description = "Secluded 5-star eco-luxury resort built on elevated stilts in deep rainforest.", PricePerNight = 9500, Rating = 4.9, Amenities = "Infinity Pool, Forest Spa, Gourmet Dining, Lounge", Address = "Yavakapadi Village, Coorg" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Dubare Elephant Camp Experience", Description = "Elephant interaction, river crossing, and ethical bathing experience on the Cauvery.", CostPerPerson = 400, TimeOfDay = TimeOfDay.Morning, Category = "Nature" },
                    new Activity { Name = "Abbey Falls & Spice Plantation Trail", Description = "Walk along cardamom, pepper, and coffee plants leading to roaring mountain falls.", CostPerPerson = 350, TimeOfDay = TimeOfDay.Afternoon, Category = "Nature" },
                    new Activity { Name = "Raja's Seat Sunset & Kodava Dinner", Description = "Watch evening mist roll over the valley followed by local spicy bamboo shoot curry.", CostPerPerson = 550, TimeOfDay = TimeOfDay.Evening, Category = "Food" }
                }
            },
            new Destination
            {
                Name = "Pondicherry",
                State = "Puducherry",
                Description = "French coastal enclave featuring cobblestone promenades, pastel colonial villas, yoga centers, and artisanal bistros.",
                Tags = "beach, heritage, cafes, food, relaxation, spiritual",
                TravelCostPerPerson = 6000,
                IdealDurationDays = 3,
                BestSeason = "October - March",
                ImageUrl = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
                Hotels = new List<Hotel>
                {
                    new Hotel { Name = "Auroville Eco Stay", Description = "Tranquil thatched-roof eco lodge surrounded by organic gardens.", PricePerNight = 1700, Rating = 4.1, Amenities = "Organic Cafe, Bicycles, Garden, WiFi", Address = "Kuilapalayam, Auroville" },
                    new Hotel { Name = "French Quarter Inn", Description = "Boutique heritage hotel with arched windows, wrought-iron balconies, and courtyard dining.", PricePerNight = 2800, Rating = 4.4, Amenities = "Courtyard Cafe, Free WiFi, AC, Library", Address = "White Town, Pondicherry" },
                    new Hotel { Name = "Palais de Mahe Resort", Description = "Luxury French colonial mansion near Promenade Beach with pool and high-end seafood.", PricePerNight = 7500, Rating = 4.8, Amenities = "Courtyard Pool, Ayurvedic Spa, Rooftop Bar", Address = "Bussy St, White Town" }
                },
                Activities = new List<Activity>
                {
                    new Activity { Name = "Matrimandir Meditation & Auroville", Description = "Morning visit to the golden sphere of peace followed by bakery breakfast.", CostPerPerson = 250, TimeOfDay = TimeOfDay.Morning, Category = "Spiritual" },
                    new Activity { Name = "White Town French Quarter Cycling", Description = "Pedal along pastel yellow streets, bougainvillea gates, and Notre Dame des Anges.", CostPerPerson = 350, TimeOfDay = TimeOfDay.Afternoon, Category = "Heritage" },
                    new Activity { Name = "Rock Beach Promenade & French Crepes", Description = "Sunset walk by Gandhi statue accompanied by artisanal croissants and seafood dinner.", CostPerPerson = 700, TimeOfDay = TimeOfDay.Evening, Category = "Food" }
                }
            }
        };

        await context.Destinations.AddRangeAsync(destinations);
        await context.SaveChangesAsync();
    }
}
