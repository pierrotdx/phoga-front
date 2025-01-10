import { AUTH_PROVISIONER_TOKEN } from '../../../core';
import { CAuthProvisionerFake } from '../../secondary/provisioners';

export const AuthProviderFake = {
  provide: AUTH_PROVISIONER_TOKEN,
  useClass: CAuthProvisionerFake,
};
