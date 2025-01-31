import { Provider } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../../core/models/environment';
import { environment } from '../../core/environment';

export const EnvironmentProvider: Provider = {
  provide: ENVIRONMENT_TOKEN,
  useValue: environment,
};
