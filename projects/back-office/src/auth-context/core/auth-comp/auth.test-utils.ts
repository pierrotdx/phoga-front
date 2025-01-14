import { CompTestUtils } from '@shared/comp.test-utils';
import {
  ENDPOINTS_TOKEN,
  EndpointsProvider,
  IEndpoints,
} from '@back-office/endpoints-context';
import { AuthComponent } from './auth.component';
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export class AuthTestUtils extends CompTestUtils<AuthComponent> {
  isAuthenticatedSpy!: jasmine.Spy;
  navigateSpy!: jasmine.Spy;
  loginSpy!: jasmine.Spy;
  logoutSpy!: jasmine.Spy;
  consoleSpy!: jasmine.Spy;

  private readonly spies: jasmine.Spy[] = [
    this.isAuthenticatedSpy,
    this.navigateSpy,
    this.loginSpy,
    this.consoleSpy,
  ];

  constructor() {
    const accessToken$ = new BehaviorSubject<string | undefined>(
      'dumb access token'
    );
    const fakeAuthService = {
      accessToken$,
      isAuthenticated: () => true,
      login: async () => {},
      logout: async () => {},
    } as AuthService;
    const providers = [
      {
        provide: AuthService,
        useValue: fakeAuthService,
      },
      EndpointsProvider,
    ];
    super(AuthComponent, { providers });
  }

  async beforeEachGlobal(): Promise<void> {
    await this.internalBeforeEach();
    this.setSpies();
  }

  private setSpies(): void {
    const authService = this.testBed.inject(AuthService);
    this.isAuthenticatedSpy = spyOn(authService, 'isAuthenticated');
    this.loginSpy = spyOn(authService, 'login');
    this.logoutSpy = spyOn(authService, 'logout');

    const router = this.testBed.inject(Router);
    this.navigateSpy = spyOn(router, 'navigate');

    this.consoleSpy = spyOn(console, 'error');
  }

  resetSpies(): void {
    this.spies.forEach((spy) => {
      spy?.and.callThrough();
    });
  }

  getEndpoints(): IEndpoints {
    return this.testBed.inject(ENDPOINTS_TOKEN);
  }

  fakeAuthenticationTo(isAuth: boolean) {
    this.isAuthenticatedSpy.and.returnValue(isAuth);
    const authService = this.testBed.inject(AuthService);
    authService.accessToken$.next(isAuth ? 'fake token' : undefined);
    this.fixture.detectChanges();
  }
}
