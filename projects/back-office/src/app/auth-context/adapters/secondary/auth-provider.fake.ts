import { IAuthProvider } from '../../core';

export class AuthProviderFake implements IAuthProvider {
  async fetchAccessToken(): Promise<string> {
    return 'fake token';
  }

  async logout(): Promise<void> {
    return;
  }
}
