import { InjectionToken } from '@angular/core';
import { ISharedEnvironment } from '@shared/environment-context';

export interface IEnvironment extends ISharedEnvironment {}

export const ENVIRONMENT_TOKEN = new InjectionToken<IEnvironment>(
  'Environment'
);
