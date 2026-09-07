import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface AuthRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:5011/api/auth';
  private readonly tokenKey = 'bookapp_jwt';

  register(request: AuthRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, request);
  }

  login(request: AuthRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => localStorage.setItem(this.tokenKey, response.token)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
