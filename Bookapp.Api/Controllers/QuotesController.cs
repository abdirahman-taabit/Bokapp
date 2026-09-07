using System.Security.Claims;
using BookApp.Api.Data;
using BookApp.Api.DTOs;
using BookApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuotesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Quote>>> GetAll()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var quotes = await _context.Quotes
            .Where(quote => quote.UserId == userId)
            .OrderBy(quote => quote.Id)
            .ToListAsync();

        return Ok(quotes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Quote>> GetById(int id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var quote = await _context.Quotes
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId);

        return quote == null ? NotFound() : Ok(quote);
    }

    [HttpPost]
    public async Task<ActionResult<Quote>> Create(QuoteRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.Text) || string.IsNullOrWhiteSpace(request.Author))
        {
            return BadRequest("Text and author are required.");
        }

        var quote = new Quote
        {
            Text = request.Text.Trim(),
            Author = request.Author.Trim(),
            UserId = userId.Value
        };

        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = quote.Id }, quote);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, QuoteRequest request)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.Text) || string.IsNullOrWhiteSpace(request.Author))
        {
            return BadRequest("Text and author are required.");
        }

        var quote = await _context.Quotes
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId);

        if (quote == null) return NotFound();

        quote.Text = request.Text.Trim();
        quote.Author = request.Author.Trim();
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var quote = await _context.Quotes
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId);

        if (quote == null) return NotFound();

        _context.Quotes.Remove(quote);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private int? GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId) ? userId : null;
    }
}
