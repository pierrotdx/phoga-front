import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service/auth.service';
import { EndpointId, ENDPOINTS_TOKEN } from '../../../endpoints-context';
import { Scope } from '../models';

export const authGuard: CanActivateFn = (route, state) => {
  try {
    const authService = inject(AuthService);
    const requiredScopes = route.data?.['scopes'] as Scope[];
    const canActivate = authService.isAuthorized(requiredScopes);
    if (!canActivate) {
      void redirectToLoginPage();
    }
    return canActivate;
  } catch (err) {
    console.error(err);
    void redirectToLoginPage();
    return false;
  }
};

async function redirectToLoginPage(): Promise<void> {
  const endpoints = inject(ENDPOINTS_TOKEN);
  const router = inject(Router);
  const redirectUrl = endpoints.getRelativePath(EndpointId.LoginPage);
  await router.navigate([redirectUrl]);
}
