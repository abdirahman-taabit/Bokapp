import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class BooksComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly bookService = inject(BookService);

  protected books: Book[] = [];
  protected errorMessage = '';
  protected isLoading = false;

  ngOnInit(): void {
    this.loadBooks();
  }

  protected loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte hämta böckerna.'),
    });
  }

  protected deleteBook(book: Book): void {
    if (!window.confirm(`Vill du radera "${book.title}"?`)) return;

    this.errorMessage = '';
    this.bookService.deleteBook(book.id).subscribe({
      next: () => {
        this.books = this.books.filter((item) => item.id !== book.id);
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte radera boken.'),
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
