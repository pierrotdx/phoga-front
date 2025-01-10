import { DebugElement, inject } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthProviderFake, AuthService } from '@back-office/auth-context';
import { Router } from '@angular/router';
import {
  ENDPOINTS_TOKEN,
  EndpointsProvider,
  IEndpoints,
} from '@back-office/endpoints-context';
import { LoginPageComponent } from './login-page.component';

export class LoginPageTestUtils {
  public readonly testBed: TestBed;

  isAuthenticatedSpy!: jasmine.Spy;
  navigateSpy!: jasmine.Spy;
  loginSpy!: jasmine.Spy;
  consoleSpy!: jasmine.Spy;

  private readonly spies: jasmine.Spy[] = [
    this.isAuthenticatedSpy,
    this.navigateSpy,
    this.loginSpy,
    this.consoleSpy,
  ];

  private fixture!: ComponentFixture<LoginPageComponent>;

  private readonly providers = [
    AuthProviderFake,
    EndpointsProvider,
    AuthService,
    Router,
  ];

  constructor() {
    this.testBed = TestBed.configureTestingModule({
      providers: this.providers,
    });
    this.setSpies();
  }

  private setSpies(): void {
    const authService = this.testBed.inject(AuthService);
    this.isAuthenticatedSpy = spyOn(authService, 'isAuthenticated');
    this.loginSpy = spyOn(authService, 'login');

    const router = this.testBed.inject(Router);
    this.navigateSpy = spyOn(router, 'navigate');

    this.consoleSpy = spyOn(console, 'error');
  }

  resetSpies(): void {
    this.spies.forEach((spy) => {
      spy?.and.callThrough();
    });
  }

  async globalSetup() {
    await this.testBed.compileComponents();
    this.fixture = this.testBed.createComponent(LoginPageComponent);
    this.fixture.detectChanges();
  }

  getComponent(): LoginPageComponent {
    return this.fixture.componentInstance;
  }

  clickOn(debugElement: DebugElement) {
    debugElement.nativeElement.click();
    tick();
  }

  getLoginButton() {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css('#login'))!;
  }

  getEndpoints(): IEndpoints {
    return this.testBed.inject(ENDPOINTS_TOKEN);
  }

  fakeAuthentication() {
    this.isAuthenticatedSpy.and.returnValue(true);
    const authService = this.testBed.inject(AuthService);
    authService.accessToken$.next('fake token');
  }
}
