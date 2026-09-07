using System.ComponentModel.DataAnnotations;

namespace BookApp.Api.DTOs;

public class QuoteRequest
{
    [Required]
    [MaxLength(1000)]
    public string Text { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Author { get; set; } = string.Empty;
}
