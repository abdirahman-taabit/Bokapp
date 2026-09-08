using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bookapp.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceDefaultQuotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            ReplaceQuote(
                migrationBuilder,
                "Kunskap är makt.",
                "Francis Bacon",
                "You have power over your mind—not outside events. Realize this, and you will find strength.",
                "Marcus Aurelius");

            ReplaceQuote(
                migrationBuilder,
                "Livet måste förstås baklänges, men levas framlänges.",
                "Søren Kierkegaard",
                "We suffer more often in imagination than in reality.",
                "Seneca");

            ReplaceQuote(
                migrationBuilder,
                "Det är aldrig för sent att bli den du kunde ha blivit.",
                "George Eliot",
                "No man is free who is not master of himself.",
                "Epictetus");

            ReplaceQuote(
                migrationBuilder,
                "Den som aldrig gjort ett misstag har aldrig provat något nytt.",
                "Albert Einstein",
                "Waste no more time arguing what a good man should be. Be one.",
                "Marcus Aurelius");

            ReplaceQuote(
                migrationBuilder,
                "Framgång är summan av små ansträngningar, upprepade dag efter dag.",
                "Robert Collier",
                "Difficulties strengthen the mind, as labor does the body.",
                "Seneca");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            ReplaceQuote(
                migrationBuilder,
                "You have power over your mind—not outside events. Realize this, and you will find strength.",
                "Marcus Aurelius",
                "Kunskap är makt.",
                "Francis Bacon");

            ReplaceQuote(
                migrationBuilder,
                "We suffer more often in imagination than in reality.",
                "Seneca",
                "Livet måste förstås baklänges, men levas framlänges.",
                "Søren Kierkegaard");

            ReplaceQuote(
                migrationBuilder,
                "No man is free who is not master of himself.",
                "Epictetus",
                "Det är aldrig för sent att bli den du kunde ha blivit.",
                "George Eliot");

            ReplaceQuote(
                migrationBuilder,
                "Waste no more time arguing what a good man should be. Be one.",
                "Marcus Aurelius",
                "Den som aldrig gjort ett misstag har aldrig provat något nytt.",
                "Albert Einstein");

            ReplaceQuote(
                migrationBuilder,
                "Difficulties strengthen the mind, as labor does the body.",
                "Seneca",
                "Framgång är summan av små ansträngningar, upprepade dag efter dag.",
                "Robert Collier");
        }

        private static void ReplaceQuote(
            MigrationBuilder migrationBuilder,
            string oldText,
            string oldAuthor,
            string newText,
            string newAuthor)
        {
            migrationBuilder.Sql(
                $"UPDATE Quotes SET Text = '{Escape(newText)}', Author = '{Escape(newAuthor)}' " +
                $"WHERE Text = '{Escape(oldText)}' AND Author = '{Escape(oldAuthor)}';");
        }

        private static string Escape(string value) => value.Replace("'", "''");
    }
}
