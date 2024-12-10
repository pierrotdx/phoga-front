import {
  AuthService as Auth0Service,
  provideAuth0,
} from '@auth0/auth0-angular';
import { AUTH_PROVISIONER_TOKEN } from '../../../core';
import { environment } from '../../../../../environments/environment';
import { AuthProvisionerAuth0 } from '../../secondary';
import { Provider } from '@angular/core';

const Auth0BuiltinProvider: Provider = provideAuth0(environment.auth0Config);

const AuthProvider: Provider = {
  provide: AUTH_PROVISIONER_TOKEN,
  useFactory: (auth0Service: Auth0Service) =>
    new AuthProvisionerAuth0(auth0Service),
  deps: [Auth0Service],
};

export const AuthProvidersAuth0 = [Auth0BuiltinProvider, AuthProvider];
