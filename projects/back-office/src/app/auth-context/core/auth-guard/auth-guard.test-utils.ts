import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth-service/auth.service';
import { EndpointsProvider } from '../../../endpoints-context';
import { AuthProviderFake } from '../../adapters';

export class AuthGuardTestUtils {
  fakeRoute = new ActivatedRouteSnapshot();
  fakeState = {} as RouterStateSnapshot;
  isAuthorizedSpy!: jasmine.Spy;
  readonly routerMock = {
    navigate: jasmine.createSpy('navigateByUrl'),
  };

  private readonly providers = [
    { provide: Router, useValue: this.routerMock },
    EndpointsProvider,
    AuthService,
    AuthProviderFake,
  ];
  private readonly testBed: TestBed;

  constructor() {
    this.testBed = TestBed.configureTestingModule({
      providers: this.providers,
    });
    this.setIsAuthorizedSpy();
  }

  private setIsAuthorizedSpy(): void {
    const authService = this.testBed.inject(AuthService);
    this.isAuthorizedSpy = spyOn(authService, 'isAuthorized');
  }

  executeGuard: CanActivateFn = (...guardParameters) =>
    this.testBed.runInInjectionContext(() => authGuard(...guardParameters));

  expectCanActivateValue(expectedValue: boolean): void {
    const canActivate = this.executeGuard(this.fakeRoute, this.fakeState);
    expect(canActivate).toEqual(expectedValue);
  }
}
