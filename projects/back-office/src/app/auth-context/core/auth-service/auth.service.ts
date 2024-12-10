import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVISIONER_TOKEN, IAuthProvisioner, Scope } from '../models';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

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

  isAuthorized(requiredScopes?: Scope[]): boolean {
    const isAuthenticated = this.isAuthenticated$.getValue();
    return isAuthenticated && this.hasRequiredScopes(requiredScopes);
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
    const userScopes = (this.decodeToken(accessToken) as any).permissions;
    return userScopes || defaultScope;
  }

  private decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
}
