using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        var username = request.Username.Trim();
        if (username.Length < 3)
        {
            return BadRequest("Username must contain at least 3 characters.");
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (existingUser != null)
        {
            return Conflict("Username already exists.");
        }

        var user = new User
        {
            Username = username,
            Quotes =
            [
                new Quote { Text = "Kunskap är makt.", Author = "Francis Bacon" },
                new Quote { Text = "Livet måste förstås baklänges, men levas framlänges.", Author = "Søren Kierkegaard" },
                new Quote { Text = "Det är aldrig för sent att bli den du kunde ha blivit.", Author = "George Eliot" },
                new Quote { Text = "Den som aldrig gjort ett misstag har aldrig provat något nytt.", Author = "Albert Einstein" },
                new Quote { Text = "Framgång är summan av små ansträngningar, upprepade dag efter dag.", Author = "Robert Collier" }
            ]
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

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
}
