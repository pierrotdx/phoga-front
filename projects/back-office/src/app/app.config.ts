import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AUTH_PROVIDER_TOKEN, AuthProviderAuth0 } from './auth-context';
import { AuthService, provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';

export const Auth0Provider = provideAuth0(environment.auth0Config);

const AuthProvider = {
  provide: AUTH_PROVIDER_TOKEN,
  useFactory: (auth0Service: AuthService) =>
    new AuthProviderAuth0(auth0Service),
  deps: [AuthService],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    Auth0Provider,
    AuthProvider,
  ],
};
