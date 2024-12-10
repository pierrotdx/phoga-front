import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

export class AuthServiceTestUtils {
  readonly authService: AuthService;

  private readonly testBed: TestBed;

  constructor(providers: any[]) {
    this.testBed = TestBed.configureTestingModule({
      providers,
    });
    this.authService = this.testBed.inject(AuthService);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated$.getValue();
  }

  getAccessToken(): string | undefined {
    return this.authService['accessToken$'].getValue();
  }
}
