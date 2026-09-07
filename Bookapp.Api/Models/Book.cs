using System.ComponentModel.DataAnnotations;

namespace BookApp.Api.Models;

public class Book
{
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    [MaxLength(200)]
    public string Author { get; set; } = "";

    public DateTime PublishedDate { get; set; }
}
