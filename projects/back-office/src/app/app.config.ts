import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { AuthProvidersAuth0 } from './auth-context';
import { EndpointsProvider } from './endpoints-context';
import { RouteProviders } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    RouteProviders,
    AuthProvidersAuth0,
    EndpointsProvider,
  ],
};
