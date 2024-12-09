import { InjectionToken } from '@angular/core';

export interface IAuthProvisioner {
  fetchAccessToken(): Promise<string | undefined>;
  logout(): Promise<void>;
}

export const AUTH_PROVISIONER_TOKEN = new InjectionToken<IAuthProvisioner>(
  'AuthProvisioner'
);
