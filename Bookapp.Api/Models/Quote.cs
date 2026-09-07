using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookApp.Api.Models;

public class Quote
{
    public int Id { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Text { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Author { get; set; } = string.Empty;

    public int UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; } = null!;
}
