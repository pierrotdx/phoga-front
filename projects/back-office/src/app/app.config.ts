import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AUTH_PROVIDER_TOKEN, AuthProviderFake } from './auth-context';

const AuthProvider = {
  provide: AUTH_PROVIDER_TOKEN,
  useClass: AuthProviderFake,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    AuthProvider,
  ],
};
