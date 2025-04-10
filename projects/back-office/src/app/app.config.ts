import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouteProviders } from './routers';
import { PhotoApiService } from '@shared/photo-context';
import {
  authHttpInterceptor,
  AuthProvidersAuth0,
} from '@back-office/auth-context';
import { EndpointsProvider } from '@back-office/endpoints-context';
import { ENVIRONMENT_TOKEN, EnvironmentProvider } from '../environment-context';

import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';
import { TagApiServiceProvider } from '@shared/tag-context';

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
    TagApiServiceProvider,
    UuidProvider,
  ],
};
