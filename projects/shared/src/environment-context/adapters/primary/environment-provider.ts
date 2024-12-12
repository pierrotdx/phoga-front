import { InjectionToken } from '@angular/core';
import { ISharedEnvironment } from '../../core';

export const ENVIRONMENT_TOKEN = new InjectionToken<ISharedEnvironment>(
  'Environment'
);
