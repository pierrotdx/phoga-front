import {
  AuthService as Auth0Service,
  AuthClientConfig,
  provideAuth0,
} from '@auth0/auth0-angular';
import { AUTH_PROVISIONER_TOKEN } from '../../../core';
import { AuthProvisionerAuth0 } from '../../secondary';
import { inject, provideAppInitializer, Provider } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../../../../../environment-context';

const Auth0BuiltinProvider: Provider = provideAuth0();

function setAuth0Config() {
  const auth0 = inject(AuthClientConfig);
  const env = inject(ENVIRONMENT_TOKEN);
  auth0.set(env.auth0Config);
}

const Auth0ConfigInitializer = provideAppInitializer(() => setAuth0Config());

const AuthProvider: Provider = {
  provide: AUTH_PROVISIONER_TOKEN,
  useFactory: (auth0Service: Auth0Service) =>
    new AuthProvisionerAuth0(auth0Service),
  deps: [Auth0Service],
};

export const AuthProvidersAuth0 = [
  Auth0BuiltinProvider,
  Auth0ConfigInitializer,
  AuthProvider,
];
