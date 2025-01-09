import {
  ApplicationConfig,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';

import {
  authHttpInterceptor,
  AuthProvidersAuth0,
  AuthService,
} from './auth-context';
import { EndpointsProvider } from './endpoints-context';
import { RouteProviders } from './app.routes';
import { ENVIRONMENT_TOKEN, EnvironmentProvider } from '../environment-context';
import { PhotoApiService } from '@shared/photo-context';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';

const PhotoApiServiceProvider: Provider = {
  provide: PhotoApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authHttpInterceptor])),
    EnvironmentProvider,
    RouteProviders,
    AuthProvidersAuth0,
    EndpointsProvider,
    PhotoApiServiceProvider,
    provideAnimationsAsync(),
    UuidProvider,
  ],
};
