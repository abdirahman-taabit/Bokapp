import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  protected errorMessage = '';
  protected isSubmitting = false;
  protected readonly successMessage =
    this.route.snapshot.queryParamMap.get('registered') === 'true'
      ? 'Registreringen lyckades. Du kan nu logga in.'
      : '';

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/books']),
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.status === 401
            ? 'Fel användarnamn eller lösenord.'
            : error.status === 0
              ? 'Kunde inte nå servern. Kontrollera att backend körs.'
              : 'Inloggningen misslyckades. Försök igen.';
      },
    });
  }
}
