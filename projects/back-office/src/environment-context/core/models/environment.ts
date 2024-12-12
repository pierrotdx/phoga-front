import { InjectionToken } from '@angular/core';
import { ISharedEnvironment } from '@shared/environment-context';

export interface IEnvironment extends ISharedEnvironment {
  auth0Config: {
    domain: string;
    clientId: string;
    authorizationParams: {
      redirect_uri: string;
      audience: string;
    };
  };
}

export const ENVIRONMENT_TOKEN = new InjectionToken<IEnvironment>(
  'Environment'
);
