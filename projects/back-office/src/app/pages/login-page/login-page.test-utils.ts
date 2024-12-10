import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../auth-context';
import { Router } from '@angular/router';
import { ENDPOINTS_TOKEN, IEndpoints } from '../../endpoints-context';
import { LoginPageComponent } from './login-page.component';

export class LoginPageTestUtils {
  public readonly testBed: TestBed;
  private fixture!: ComponentFixture<LoginPageComponent>;

  constructor(providers: any[]) {
    this.testBed = TestBed.configureTestingModule({
      providers,
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

  getLoginSpy() {
    const authService = this.testBed.inject(AuthService);
    return spyOn(authService, 'login');
  }

  getNavigateSpy() {
    const router = this.testBed.inject(Router);
    return spyOn(router, 'navigate');
  }
}
