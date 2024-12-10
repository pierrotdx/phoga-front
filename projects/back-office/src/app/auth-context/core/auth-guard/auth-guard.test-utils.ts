import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth-service/auth.service';
import { Scope } from '../models';

export class AuthGuardTestUtils {
  private readonly testBed: TestBed;
  private readonly authService: AuthService;

  fakeRoute = new ActivatedRouteSnapshot();
  fakeState = {} as RouterStateSnapshot;

  constructor(providers: any[]) {
    this.testBed = TestBed.configureTestingModule({
      providers,
    });
    this.authService = this.testBed.inject(AuthService);
  }

  executeGuard: CanActivateFn = (...guardParameters) =>
    this.testBed.runInInjectionContext(() => authGuard(...guardParameters));

  emitIsAuthenticated(value: boolean): void {
    this.authService.isAuthenticated$.next(value);
  }

  fakeUserScopes(scopes: Scope[] = []) {
    spyOn(this.authService as any, 'getUserScopes').and.returnValue(scopes);
  }

  setScopesScenario(requiredScopes: Scope[], userScopes: Scope[]): void {
    this.fakeRoute.data = { scopes: requiredScopes };
    this.fakeUserScopes(userScopes);
  }

  expectCanActivateValue(expectedValue: boolean): void {
    const canActivate = this.executeGuard(this.fakeRoute, this.fakeState);
    expect(canActivate).toEqual(expectedValue);
  }
}
