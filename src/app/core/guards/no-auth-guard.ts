import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token-service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.hasToken()) {
    return true;   // ← no token, allow access to login/register
  }

  // Already logged in — redirect to journals
  router.navigate(['/journals']);
  return false;
};
