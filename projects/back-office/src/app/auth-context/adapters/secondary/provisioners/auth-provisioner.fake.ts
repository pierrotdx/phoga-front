import { IAuthProvisioner } from '../../../core';

export class CAuthProvisionerFake implements IAuthProvisioner {
  async fetchAccessToken(): Promise<string> {
    return 'fake token';
  }

  async logout(): Promise<void> {
    return;
  }
}
