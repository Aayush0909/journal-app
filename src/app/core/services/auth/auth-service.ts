import { HttpClient, HttpContextToken } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { TokenService } from '../token/token-service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private apiUrl = environment.apiUrl;

  // Signal — who is logged in right now
  private currentUser = signal<string | null>(null);

  // Anyone can read this, nobody outside can change it
  readonly username = this.currentUser.asReadonly();

  // Automatically true when currentUser has a value
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  // ─── Register ───────────────────────────────────────
  // Sends username + password to backend, no token returned
  register(data: { userName: string; password: string }) {
    return this.http.post(`${this.apiUrl}/public/signup`, data);
  }

  // ─── Login ──────────────────────────────────────────
  // Sends credentials, gets JWT back, saves it
  login(data: { userName: string; password: string }) {
    // Ensure response is returned as text so we receive a string token
    return this.http.post(
      `${this.apiUrl}/public/login`,
      data,
      { responseType: 'text' as const }
    ).pipe(
      tap((token: string) => {
        // Save token to localStorage
        this.tokenService.setToken(token);
        // Decode the JWT payload to extract the username
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser.set(payload.sub);  // 'sub' = subject = username
      })
    );
  }

  // ─── Logout ─────────────────────────────────────────
  logout() {
    this.tokenService.removeToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
