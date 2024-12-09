import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { EndpointId, ENDPOINTS_TOKEN } from '../../../endpoints-context';

export const authGuard: CanActivateFn = (route, state) => {
  try {
    const authService = inject(AuthService);
    const isAuthenticated = authService.isAuthenticated$.getValue();
    if (!isAuthenticated) {
      void redirectToLoginPage();
    }
    return isAuthenticated;
  } catch (err) {
    console.error(err);
    void redirectToLoginPage();
    return false;
  }
};

const redirectToLoginPage = async (): Promise<void> => {
  const endpoints = inject(ENDPOINTS_TOKEN);
  const router = inject(Router);
  const redirectUrl = endpoints.getRelativePath(EndpointId.LoginPage);
  await router.navigate([redirectUrl]);
};
