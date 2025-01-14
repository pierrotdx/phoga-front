import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AuthProviderFake, AuthService } from '@back-office/auth-context';
import { EndpointsProvider } from '@back-office/endpoints-context';
import { RouterModule } from '@angular/router';

export class NavigationTestUtils {
  component!: NavigationComponent;

  isAuthenticatedSpy!: jasmine.Spy;
  logoutSpy!: jasmine.Spy;

  private readonly spies: jasmine.Spy[] = [
    this.isAuthenticatedSpy,
    this.logoutSpy,
  ];

  private readonly testBed: TestBed;
  private readonly authService: AuthService;
  private fixture!: ComponentFixture<NavigationComponent>;

  constructor() {
    const providers = [AuthProviderFake, EndpointsProvider];
    this.testBed = TestBed.configureTestingModule({
      providers,
      imports: [NavigationComponent, RouterModule.forRoot([])],
    });
    this.authService = this.testBed.inject(AuthService);
    this.setSpies();
  }

  private setSpies(): void {
    this.logoutSpy = spyOn(this.authService, 'logout');
    this.isAuthenticatedSpy = spyOn(this.authService, 'isAuthenticated');
  }

  resetSpies(): void {
    this.spies.forEach((spy) => {
      spy?.and.callThrough();
    });
  }

  async globalSetup() {
    await this.testBed.compileComponents();

    this.fixture = TestBed.createComponent(NavigationComponent);
    this.component = this.fixture.componentInstance;

    this.fixture.detectChanges();
    this.getLogoutButton();
  }

  getLogoutButton(): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css('#logout'))!;
  }

  triggerLogin() {
    this.isAuthenticatedSpy.and.returnValue(true);
    this.authService.accessToken$.next('fake token');
    this.fixture.detectChanges();
  }

  triggerLogout() {
    this.isAuthenticatedSpy.and.returnValue(false);
    this.authService.accessToken$.next(undefined);
    this.fixture.detectChanges();
  }

  clickOnLogoutButton() {
    this.logoutSpy.and.resolveTo();
    const logoutButton = this.getLogoutButton();
    logoutButton.nativeElement.click();
    tick();
  }
}
