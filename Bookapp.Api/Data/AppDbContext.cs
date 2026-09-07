using Microsoft.EntityFrameworkCore;
using BookApp.Api.Models;

namespace BookApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Quote> Quotes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(user => user.Quotes)
            .WithOne(quote => quote.User)
            .HasForeignKey(quote => quote.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
