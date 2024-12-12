import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { AuthProvidersAuth0 } from './auth-context';
import { EndpointsProvider } from './endpoints-context';
import { RouteProviders } from './app.routes';
import { ENVIRONMENT_TOKEN, EnvironmentProvider } from '../environment-context';
import { PhotoApiService } from '@shared/photo-context';
import { HttpClient, provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    EnvironmentProvider,
    RouteProviders,
    AuthProvidersAuth0,
    EndpointsProvider,
    {
      provide: PhotoApiService,
      deps: [ENVIRONMENT_TOKEN, HttpClient],
    },
  ],
};
