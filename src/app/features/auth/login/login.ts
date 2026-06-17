import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // For easy access in the template (getters also trigger change detection when form state changes)
  
  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => this.router.navigate(['/journals']),
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.status === 401 ? 'Invalid username or password.' : 'Something went wrong.'
        );
      }
    });
  }

}
