import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AuthService } from '../../auth-context';

export class HeaderTestUtils {
  component!: HeaderComponent;

  private readonly testBed: TestBed;
  private fixture!: ComponentFixture<HeaderComponent>;

  constructor(providers: any[]) {
    this.testBed = TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers,
    });
  }

  async globalSetup() {
    await this.testBed.compileComponents();

    this.fixture = TestBed.createComponent(HeaderComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  getLogoutButton(): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css('#logout'))!;
  }

  triggerLogin() {
    const authService = this.testBed.inject(AuthService);
    authService.isAuthenticated$.next(true);
    this.fixture.detectChanges();
  }

  triggerLogout() {
    const authService = this.testBed.inject(AuthService);
    authService.isAuthenticated$.next(false);
    this.fixture.detectChanges();
  }

  clickOn(debugElement: DebugElement) {
    debugElement.nativeElement.click();
    tick();
  }

  getLogoutSpy() {
    const authService = this.testBed.inject(AuthService);
    return spyOn(authService, 'logout');
  }
}
