import { InjectionToken } from '@angular/core';

export interface IAuthProvider {
  fetchAccessToken(): Promise<string>;
  logout(): Promise<void>;
}

export const AUTH_PROVIDER_TOKEN = new InjectionToken<IAuthProvider>(
  'AuthProvider'
);
