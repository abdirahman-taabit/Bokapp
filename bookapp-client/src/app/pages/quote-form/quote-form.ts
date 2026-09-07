import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { QuoteRequest } from '../../models/quote';
import { AuthService } from '../../services/auth.service';
import { QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
})
export class QuoteFormComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly quoteService = inject(QuoteService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private quoteId: number | null = null;

  protected readonly quoteForm = this.formBuilder.nonNullable.group({
    text: ['', [Validators.required, Validators.maxLength(1000)]],
    author: ['', [Validators.required, Validators.maxLength(200)]],
  });
  protected isEditMode = false;
  protected isLoading = false;
  protected isSubmitting = false;
  protected errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.quoteId = id;
      this.isEditMode = true;
      this.loadQuote(id);
    }
  }

  protected onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const values = this.quoteForm.getRawValue();
    const request: QuoteRequest = {
      text: values.text.trim(),
      author: values.author.trim(),
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    const operation: Observable<unknown> =
      this.quoteId === null
        ? this.quoteService.createQuote(request)
        : this.quoteService.updateQuote(this.quoteId, request);

    operation.subscribe({
      next: () => void this.router.navigate(['/quotes']),
      error: (error: HttpErrorResponse) => this.handleError(error, 'Kunde inte spara citatet.'),
    });
  }

  private loadQuote(id: number): void {
    this.isLoading = true;
    this.quoteService.getQuote(id).subscribe({
      next: (quote) => {
        this.quoteForm.setValue({ text: quote.text, author: quote.author });
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => this.handleError(error, 'Citatet kunde inte hittas.'),
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
