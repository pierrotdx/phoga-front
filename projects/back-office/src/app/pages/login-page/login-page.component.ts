import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageRoute } from '../../routes-context';
import { AuthService } from '../../auth-context';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  isAuthenticated = signal<boolean>(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.isAuthenticated$.subscribe(this.onAuthenticationChange);
  }

  private onAuthenticationChange = (isAuthenticated: boolean) => {
    this.isAuthenticated.set(isAuthenticated);
  };

  async login() {
    await this.authService.login();
    const redirectUrl = HomePageRoute.getRelativePath();
    this.router.navigate([redirectUrl]);
  }

  async logout() {
    await this.authService.logout();
  }
}
