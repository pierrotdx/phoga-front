import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVISIONER_TOKEN, IAuthProvisioner } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private readonly accessToken$ = new BehaviorSubject<string | undefined>(
    undefined
  );

  constructor(
    @Inject(AUTH_PROVISIONER_TOKEN)
    private readonly authProvisioner: IAuthProvisioner
  ) {
    this.accessToken$.subscribe(this.onAccessTokenChange);
  }

  onAccessTokenChange = (accessToken: string | undefined): void => {
    this.isAuthenticated$.next(!!accessToken);
  };

  async login(): Promise<void> {
    const accessToken = await this.authProvisioner.fetchAccessToken();
    this.accessToken$.next(accessToken);
  }

  async getAccessToken(): Promise<string | undefined> {
    if (!this.isAuthenticated$.getValue()) {
      await this.login();
    }
    const accessToken = this.accessToken$.getValue();
    return accessToken;
  }

  async logout(): Promise<void> {
    await this.authProvisioner.logout();
    this.accessToken$.next(undefined);
  }
}
