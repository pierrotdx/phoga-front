import { AuthService } from '@auth0/auth0-angular';
import { IAuthProvisioner } from '../../../core';
import { firstValueFrom } from 'rxjs';

export class AuthProvisionerAuth0 implements IAuthProvisioner {
  constructor(private readonly auth0Service: AuthService) {}

  async fetchAccessToken(): Promise<string | undefined> {
    const accessToken$ = firstValueFrom(
      this.auth0Service.getAccessTokenWithPopup({ cacheMode: 'off' })
    );
    return await accessToken$;
  }

  async logout(): Promise<void> {
    const logout$ = firstValueFrom(this.auth0Service.logout());
    await logout$;
  }
}
