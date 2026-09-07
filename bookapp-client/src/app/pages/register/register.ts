import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [this.passwordsMatch] },
  );
  protected errorMessage = '';
  protected isSubmitting = false;

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.registerForm.getRawValue();
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.register({ username, password }).subscribe({
      next: () => void this.router.navigate(['/login'], { queryParams: { registered: true } }),
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage =
          error.status === 409
            ? 'Användarnamnet finns redan.'
            : error.status === 0
              ? 'Kunde inte nå servern. Kontrollera att backend körs.'
              : 'Registreringen misslyckades. Kontrollera uppgifterna och försök igen.';
      },
    });
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    return control.get('password')?.value === control.get('confirmPassword')?.value
      ? null
      : { passwordsDoNotMatch: true };
  }
}
