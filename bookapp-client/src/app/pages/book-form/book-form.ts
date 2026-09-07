import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { BookRequest } from '../../models/book';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.scss',
})
export class BookFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly bookService = inject(BookService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private bookId: number | null = null;

  protected readonly bookForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    author: ['', [Validators.required, Validators.maxLength(200)]],
    publishedDate: ['', Validators.required],
  });
  protected isEditMode = false;
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.bookId = id;
      this.isEditMode = true;
      this.loadBook(id);
    }
  }

  protected onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const values = this.bookForm.getRawValue();
    const request: BookRequest = {
      title: values.title.trim(),
      author: values.author.trim(),
      publishedDate: values.publishedDate,
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    const operation: Observable<unknown> =
      this.bookId === null
        ? this.bookService.createBook(request)
        : this.bookService.updateBook(this.bookId, request);

    operation.subscribe({
      next: () => void this.router.navigate(['/books']),
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte spara boken.'),
    });
  }

  private loadBook(id: number): void {
    this.isLoading = true;
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.bookForm.setValue({
          title: book.title,
          author: book.author,
          publishedDate: book.publishedDate.substring(0, 10),
        });
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Boken kunde inte hittas.'),
    });
  }

  private handleError(error: HttpErrorResponse, fallbackMessage: string): void {
    this.isLoading = false;
    this.isSubmitting = false;
    if (error.status === 401) {
      this.authService.logout();
      return;
    }

    this.errorMessage =
      error.status === 0 ? 'Kunde inte nå servern. Kontrollera att backend körs.' : fallbackMessage;
  }
}
