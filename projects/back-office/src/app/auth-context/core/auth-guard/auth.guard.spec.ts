import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../auth-service/auth.service';
import { AuthProviderFake } from '../../adapters';
import { AuthGuard } from '@auth0/auth0-angular';
import { EndpointsProvider } from '../../../endpoints-context';

describe(`${AuthGuard.name}`, () => {
  const fakeRoute = {} as ActivatedRouteSnapshot;
  const fakeState = {} as RouterStateSnapshot;
  const routerMock = {
    navigate: jasmine.createSpy('navigateByUrl'),
  };
  let authService: AuthService;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthProviderFake,
        { provide: Router, useValue: routerMock },
        EndpointsProvider,
      ],
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return `false` when the user is not authenticated and navigate to the login page', () => {
    authService.isAuthenticated$.next(false);
    const canActivate = executeGuard(fakeRoute, fakeState);
    expect(canActivate).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should return `true` when the user is authenticated', () => {
    authService.isAuthenticated$.next(true);
    const canActivate = executeGuard(fakeRoute, fakeState);
    expect(canActivate).toBeTrue();
  });
});
