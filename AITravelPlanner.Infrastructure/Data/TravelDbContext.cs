using AITravelPlanner.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AITravelPlanner.Infrastructure.Data;

public class TravelDbContext : DbContext
{
    public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Destination> Destinations => Set<Destination>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<TripTraveller> TripTravellers => Set<TripTraveller>();
    public DbSet<ItineraryDay> ItineraryDays => Set<ItineraryDay>();
    public DbSet<SavedPlan> SavedPlans => Set<SavedPlan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Email).HasMaxLength(150).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
        });

        // Destination
        modelBuilder.Entity<Destination>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.State).HasMaxLength(100);
            entity.Property(e => e.TravelCostPerPerson).HasPrecision(18, 2);
            entity.HasMany(e => e.Hotels)
                  .WithOne(h => h.Destination)
                  .HasForeignKey(h => h.DestinationId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(e => e.Activities)
                  .WithOne(a => a.Destination)
                  .HasForeignKey(a => a.DestinationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Hotel
        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
            entity.Property(e => e.PricePerNight).HasPrecision(18, 2);
        });

        // Activity
        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(150).IsRequired();
            entity.Property(e => e.CostPerPerson).HasPrecision(18, 2);
        });

        // Trip
        modelBuilder.Entity<Trip>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalBudget).HasPrecision(18, 2);
            entity.Property(e => e.EstimatedTotalCost).HasPrecision(18, 2);
            entity.Property(e => e.RemainingBudget).HasPrecision(18, 2);
            entity.Property(e => e.ChosenHotelPricePerNight).HasPrecision(18, 2);
            entity.Property(e => e.TravelCost).HasPrecision(18, 2);
            entity.Property(e => e.HotelCost).HasPrecision(18, 2);
            entity.Property(e => e.FoodCost).HasPrecision(18, 2);
            entity.Property(e => e.ActivitiesCost).HasPrecision(18, 2);
            entity.Property(e => e.MiscCost).HasPrecision(18, 2);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Trips)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(e => e.ItineraryDays)
                  .WithOne(d => d.Trip)
                  .HasForeignKey(d => d.TripId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.TravellersList)
                  .WithOne(t => t.Trip)
                  .HasForeignKey(t => t.TripId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ItineraryDay
        modelBuilder.Entity<ItineraryDay>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EstimatedDailyCost).HasPrecision(18, 2);
        });

        // SavedPlan
        modelBuilder.Entity<SavedPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.SavedPlans)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Trip)
                  .WithMany(t => t.SavedPlans)
                  .HasForeignKey(e => e.TripId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
