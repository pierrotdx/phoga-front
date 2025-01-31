import {
  ApplicationConfig,
  Provider,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { PhotoApiService } from '@shared/photo-context';
import { ENVIRONMENT_TOKEN, EnvironmentProvider } from '../environment-context';

const PhotoApiServiceProvider: Provider = {
  provide: PhotoApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    PhotoApiServiceProvider,
    EnvironmentProvider,
  ],
};
