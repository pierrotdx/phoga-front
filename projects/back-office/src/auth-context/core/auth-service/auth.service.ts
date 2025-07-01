import { Inject, Injectable } from '@angular/core';
import { AUTH_PROVISIONER_TOKEN, IAuthProvisioner, Scope } from '../models';
import { BehaviorSubject } from 'rxjs';
import { TokenUtilsService } from '../token-utils-service/token-utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly accessToken$ = new BehaviorSubject<string | undefined>(
    undefined
  );

  constructor(
    @Inject(AUTH_PROVISIONER_TOKEN)
    private readonly authProvisioner: IAuthProvisioner,
    private readonly tokenService: TokenUtilsService
  ) {
    this.initTokenFromStorage();
  }

  private initTokenFromStorage(): void {
    const storedToken = this.tokenService.getTokenFromStorage();
    if (storedToken) {
      this.accessToken$.next(storedToken);
    }
  }

  async login(): Promise<void> {
    const accessToken = await this.authProvisioner.fetchAccessToken();
    this.accessToken$.next(accessToken);
    this.tokenService.setStoredToken(accessToken);
  }

  isAuthenticated(): boolean {
    const accessToken = this.accessToken$.getValue();
    const hasValidToken = this.tokenService.isTokenValid(accessToken);
    return hasValidToken;
  }

  isAuthorized(requiredScopes?: Scope[]): boolean {
    return this.isAuthenticated() && this.hasRequiredScopes(requiredScopes);
  }

  async logout(): Promise<void> {
    await this.authProvisioner.logout();
    this.tokenService.clearStoredToken();
    this.accessToken$.next(undefined);
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
    const userScopes = (this.tokenService.decodeToken(accessToken) as any)
      .permissions;
    return userScopes ?? defaultScope;
  }
}
