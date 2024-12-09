import {
  AuthService as Auth0Service,
  provideAuth0,
} from '@auth0/auth0-angular';
import { AUTH_PROVIDER_TOKEN } from '../../core';
import { environment } from '../../../../environments/environment';
import { AuthProviderAuth0 } from '../secondary';

const Auth0Provider = provideAuth0(environment.auth0Config);

const AuthProvider = {
  provide: AUTH_PROVIDER_TOKEN,
  useFactory: (auth0Service: Auth0Service) =>
    new AuthProviderAuth0(auth0Service),
  deps: [Auth0Service],
};

export const AuthProvidersAuth0 = [Auth0Provider, AuthProvider];
