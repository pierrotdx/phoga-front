import { IAuthProvider } from '../../core';

export class CAuthProviderFake implements IAuthProvider {
  async fetchAccessToken(): Promise<string> {
    return 'fake token';
  }

  async logout(): Promise<void> {
    return;
  }
}
