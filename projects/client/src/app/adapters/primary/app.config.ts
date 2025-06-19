import {
  ApplicationConfig,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from '../../core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  PhotoApiService,
  PhotoUtilsServiceProvider,
} from '@shared/photo-context';
import {
  ENVIRONMENT_TOKEN,
  EnvironmentProvider,
} from '../../../environment-context';
import { TagApiService } from '@shared/tag-context';

const PhotoApiServiceProvider: Provider = {
  provide: PhotoApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};

export const TagApiServiceProvider = {
  provide: TagApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};

const inMemoryScrollingFeature: InMemoryScrollingOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling(inMemoryScrollingFeature)),
    provideHttpClient(),
    PhotoApiServiceProvider,
    PhotoUtilsServiceProvider,
    TagApiServiceProvider,
    EnvironmentProvider,
  ],
};
