import { AUTH_PROVIDER_TOKEN } from '../../core';
import { CAuthProviderFake } from '../secondary';

export const AuthProviderFake = {
  provide: AUTH_PROVIDER_TOKEN,
  useClass: CAuthProviderFake,
};
