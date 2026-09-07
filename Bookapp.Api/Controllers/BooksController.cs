using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookApp.Api.Models;
using BookApp.Api.Data;
using Microsoft.AspNetCore.Authorization;

namespace BookApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Book>>> GetAll()
    {
        return Ok(await _context.Books.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetById(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        return Ok(book);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> Create(Book book)
    {
        var validationError = ValidateBook(book);
        if (validationError != null) return BadRequest(validationError);

        book.Title = book.Title.Trim();
        book.Author = book.Author.Trim();
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Book updatedBook)
    {
        var validationError = ValidateBook(updatedBook);
        if (validationError != null) return BadRequest(validationError);

        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        book.Title = updatedBook.Title.Trim();
        book.Author = updatedBook.Author.Trim();
        book.PublishedDate = updatedBook.PublishedDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static string? ValidateBook(Book book)
    {
        if (string.IsNullOrWhiteSpace(book.Title)) return "Title is required.";
        if (string.IsNullOrWhiteSpace(book.Author)) return "Author is required.";
        if (book.PublishedDate == default) return "Published date is required.";
        return null;
    }
}
