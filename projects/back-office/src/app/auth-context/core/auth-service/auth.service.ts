import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVISIONER_TOKEN, IAuthProvisioner, Scope } from '../models';
import { BehaviorSubject } from 'rxjs';
import { TokenHandler } from './token-handler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  private readonly accessToken$ = new BehaviorSubject<string | undefined>(
    undefined
  );
  private readonly tokenHandler = new TokenHandler();

  constructor(
    @Inject(AUTH_PROVISIONER_TOKEN)
    private readonly authProvisioner: IAuthProvisioner
  ) {
    this.accessToken$.subscribe(this.onAccessTokenChange);
    this.initTokenFromStorage();
  }

  private onAccessTokenChange = (accessToken: string | undefined): void => {
    this.tokenHandler.updateStoredToken(accessToken);
    this.isAuthenticated$.next(this.isAuthenticated());
  };

  private initTokenFromStorage(): void {
    const storedToken = this.tokenHandler.getTokenFromStorage();
    if (storedToken) {
      this.accessToken$.next(storedToken);
    }
  }

  async login(): Promise<void> {
    const accessToken = await this.authProvisioner.fetchAccessToken();
    this.accessToken$.next(accessToken);
  }

  async getAccessToken(): Promise<string | undefined> {
    if (!this.isAuthenticated()) {
      await this.login();
    }
    const accessToken = this.accessToken$.getValue();
    return accessToken;
  }

  private isAuthenticated(): boolean {
    const accessToken = this.accessToken$.getValue();
    return this.tokenHandler.isTokenValid(accessToken);
  }

  async logout(): Promise<void> {
    await this.authProvisioner.logout();
    this.tokenHandler.clearStoredToken();
    this.accessToken$.next(undefined);
  }

  isAuthorized(requiredScopes?: Scope[]): boolean {
    return this.isAuthenticated() && this.hasRequiredScopes(requiredScopes);
  }

  private hasRequiredScopes(requiredScopes: Scope[] = []): boolean {
    if (!requiredScopes.length) {
      return true;
    }
    const userScopes = this.getUserScopes();
    const hasMissingScope = requiredScopes.some(
      (scope) => !userScopes.includes(scope)
    );
    return !hasMissingScope;
  }

  private getUserScopes(): Scope[] {
    const accessToken = this.accessToken$.getValue();
    const defaultScope: Scope[] = [];
    if (!accessToken) {
      return defaultScope;
    }
    const userScopes = (this.tokenHandler.decodeToken(accessToken) as any)
      .permissions;
    return userScopes || defaultScope;
  }
}
