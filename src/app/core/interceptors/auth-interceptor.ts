import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../services/token/token-service';
import { inject } from '@angular/core/primitives/di';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
 
  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
