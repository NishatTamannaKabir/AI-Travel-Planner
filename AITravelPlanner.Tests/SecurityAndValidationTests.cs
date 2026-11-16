using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AITravelPlanner.Application.DTOs.Auth;
using AITravelPlanner.Application.DTOs.Trips;
using AITravelPlanner.Domain.Entities;
using AITravelPlanner.Infrastructure.Configuration;
using AITravelPlanner.Infrastructure.Security;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Xunit;

namespace AITravelPlanner.Tests;

public class SecurityAndValidationTests
{
    private readonly PasswordHasher _passwordHasher = new();
    private readonly JwtTokenService _jwtService;

    public SecurityAndValidationTests()
    {
        var options = Options.Create(new JwtOptions
        {
            SecretKey = "A_Very_Long_And_Secure_Secret_Key_For_Testing_Only_Must_Be_Long!",
            Issuer = "TestIssuer",
            Audience = "TestAudience",
            ExpirationHours = 2
        });
        _jwtService = new JwtTokenService(options);
    }

    [Fact]
    public void PasswordHasher_HashesAndVerifiesCorrectly()
    {
        string rawPassword = "StrongPassword123!";
        string hash1 = _passwordHasher.HashPassword(rawPassword);
        string hash2 = _passwordHasher.HashPassword(rawPassword);

        // Salt ensures hashes are unique
        hash1.Should().NotBe(hash2);

        // Verification succeeds
        _passwordHasher.VerifyPassword(rawPassword, hash1).Should().BeTrue();
        _passwordHasher.VerifyPassword(rawPassword, hash2).Should().BeTrue();
        _passwordHasher.VerifyPassword("WrongPassword", hash1).Should().BeFalse();
    }

    [Fact]
    public void JwtTokenService_GeneratesAndValidatesToken()
    {
        var user = new User
        {
            Id = 42,
            Email = "explorer@india.com",
            FullName = "India Explorer"
        };

        string token = _jwtService.GenerateToken(user);
        token.Should().NotBeNullOrWhiteSpace();

        int? userId = _jwtService.ValidateTokenAndGetUserId(token);
        userId.Should().Be(42);
    }

    [Theory]
    [InlineData("Valid Name", "valid@email.com", "validPassword123", true)]
    [InlineData("", "valid@email.com", "validPassword123", false)] // Empty name
    [InlineData("Valid Name", "invalid-email", "validPassword123", false)] // Bad email
    [InlineData("Valid Name", "valid@email.com", "123", false)] // Password too short
    public void RegisterRequest_Validation_BehavesCorrectly(
        string name, string email, string password, bool expectedValid)
    {
        var request = new RegisterRequest
        {
            FullName = name,
            Email = email,
            Password = password
        };

        var context = new ValidationContext(request);
        var validationResults = new List<ValidationResult>();
        bool isValid = Validator.TryValidateObject(request, context, validationResults, true);

        isValid.Should().Be(expectedValid);
    }

    [Theory]
    [InlineData(500, false)] // Below 1000 min
    [InlineData(25000, true)]
    public void PlanTripRequest_BudgetValidation_BehavesCorrectly(decimal budget, bool expectedValid)
    {
        var request = new PlanTripRequest
        {
            BudgetInRupees = budget,
            Days = 3,
            Travellers = 2
        };

        var context = new ValidationContext(request);
        var validationResults = new List<ValidationResult>();
        bool isValid = Validator.TryValidateObject(request, context, validationResults, true);

        isValid.Should().Be(expectedValid);
    }
}
