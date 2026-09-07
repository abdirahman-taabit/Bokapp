import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quote } from '../../models/quote';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss',
})
export class QuotesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly quoteService = inject(QuoteService);

  protected quotes: Quote[] = [];
  protected errorMessage = '';
  protected isLoading = false;

  ngOnInit(): void {
    this.loadQuotes();
  }

  protected loadQuotes(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte hämta citaten.'),
    });
  }

  protected deleteQuote(quote: Quote): void {
    if (!window.confirm(`Vill du radera citatet av ${quote.author}?`)) return;

    this.errorMessage = '';
    this.quoteService.deleteQuote(quote.id).subscribe({
      next: () => {
        this.quotes = this.quotes.filter((item) => item.id !== quote.id);
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte radera citatet.'),
    });
  }

  private handleError(error: HttpErrorResponse, fallbackMessage: string): void {
    this.isLoading = false;
    if (error.status === 401) {
      this.authService.logout();
      return;
    }

    this.errorMessage =
      error.status === 0 ? 'Kunde inte nå servern. Kontrollera att backend körs.' : fallbackMessage;
  }
}
