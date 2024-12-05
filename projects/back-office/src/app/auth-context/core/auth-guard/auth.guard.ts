import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { LoginPageRoute } from '../../../routes-context';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(AuthService).isAuthenticated$.getValue();
  if (!isAuthenticated) {
    const redirectUrl = LoginPageRoute.getRelativePath();
    inject(Router).navigate([redirectUrl]);
  }
  return isAuthenticated;
};
