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
import { PhotoApiService } from '@shared/photo-context';
import { authHttpInterceptor, AuthProvidersAuth0 } from '../../../auth-context';
import { EndpointsProvider } from '../../../endpoints-context';
import {
  ENVIRONMENT_TOKEN,
  EnvironmentProvider,
} from '../../../environment-context';

import { UuidProvider } from '@shared/uuid-context/adapters/primary/uuid-provider';
import { RouteProviders } from '../../core';
import { TagApiService } from '@shared/tag-context';

const PhotoApiServiceProvider: Provider = {
  provide: PhotoApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};

export const TagApiServiceProvider = {
  provide: TagApiService,
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
