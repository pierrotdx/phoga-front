import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVIDER_TOKEN, IAuthProvider } from '../models';
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
    @Inject(AUTH_PROVIDER_TOKEN)
    private readonly authProvider: IAuthProvider
  ) {
    this.accessToken$.subscribe(this.onAccessTokenChange);
  }

  onAccessTokenChange = (accessToken: string | undefined): void => {
    this.isAuthenticated$.next(!!accessToken);
  };

  async login(): Promise<void> {
    const accessToken = await this.authProvider.fetchAccessToken();
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
    await this.authProvider.logout();
    this.accessToken$.next(undefined);
  }
}
