using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using BookApp.Api.Data;
using BookApp.Api.DTOs;
using BookApp.Api.Models;
using BookApp.Api.Services;

namespace BookApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<User>();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var username = NormalizeUsername(request.Username);
        if (username.Length < 3)
        {
            return BadRequest("Username must contain at least 3 characters.");
        }

        var existingUser = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == username);

        if (existingUser)
        {
            return Conflict("Username already exists.");
        }

        var user = new User
        {
            Username = username,
            Quotes =
            [
                new Quote
                {
                    Text = "You have power over your mind—not outside events. Realize this, and you will find strength.",
                    Author = "Marcus Aurelius"
                },
                new Quote
                {
                    Text = "We suffer more often in imagination than in reality.",
                    Author = "Seneca"
                },
                new Quote
                {
                    Text = "No man is free who is not master of himself.",
                    Author = "Epictetus"
                },
                new Quote
                {
                    Text = "Waste no more time arguing what a good man should be. Be one.",
                    Author = "Marcus Aurelius"
                },
                new Quote
                {
                    Text = "Difficulties strengthen the mind, as labor does the body.",
                    Author = "Seneca"
                }
            ]
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception)
            when (exception.InnerException is SqliteException { SqliteErrorCode: 19 })
        {
            return Conflict("Username already exists.");
        }

        return Ok(new
        {
            message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var username = NormalizeUsername(request.Username);
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username);

        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid username or password.");
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new
        {
            token
        });
    }

    private static string NormalizeUsername(string username) =>
        username.Trim().ToLowerInvariant();
}
