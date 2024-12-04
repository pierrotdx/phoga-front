import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVIDER_TOKEN, IAuthProvider } from './models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly accessToken$ = new BehaviorSubject<string | undefined>(
    undefined
  );

  constructor(
    @Inject(AUTH_PROVIDER_TOKEN)
    private readonly authProvider: IAuthProvider
  ) {}

  isAuthenticated(): boolean {
    const hasAccessToken = !!this.accessToken$.getValue();
    return hasAccessToken;
  }

  async login(): Promise<void> {
    const accessToken = await this.authProvider.fetchAccessToken();
    this.accessToken$.next(accessToken);
  }

  async getAccessToken(): Promise<string | undefined> {
    if (!this.isAuthenticated()) {
      await this.login();
    }
    const accessToken = this.accessToken$.getValue();
    return accessToken;
  }

  async logout(): Promise<void> {
    await this.authProvider.logout();
    this.accessToken$.next(undefined);
  }
}
