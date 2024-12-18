import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { TokenUtilsService } from '../token-utils-service/token-utils.service';
import { AUTH_PROVISIONER_TOKEN, Scope } from '../models';
import { AuthProviderFake } from '../../adapters';

export class AuthServiceTestUtils {
  fetchAccessTokenSpy!: jasmine.Spy;
  setStoredTokenSpy!: jasmine.Spy;
  clearStoredTokenSpy!: jasmine.Spy;
  isTokenValidSpy!: jasmine.Spy;
  getUserScopesSpy!: jasmine.Spy;

  readonly authService: AuthService;

  private readonly testBed: TestBed;

  constructor() {
    const providers = [AuthProviderFake, TokenUtilsService];
    this.testBed = TestBed.configureTestingModule({
      providers,
    });
    this.authService = this.testBed.inject(AuthService);
    this.setSpies();
  }

  private setSpies(): void {
    const authProvisioner = this.testBed.inject(AUTH_PROVISIONER_TOKEN);
    const tokenUtilsService = this.testBed.inject(TokenUtilsService);
    this.fetchAccessTokenSpy = spyOn(authProvisioner, 'fetchAccessToken');
    this.setStoredTokenSpy = spyOn(tokenUtilsService, 'setStoredToken');
    this.isTokenValidSpy = spyOn(tokenUtilsService, 'isTokenValid');
    this.clearStoredTokenSpy = spyOn(tokenUtilsService, 'clearStoredToken');
    this.getUserScopesSpy = spyOn(this.authService as any, 'getUserScopes');
  }
}
