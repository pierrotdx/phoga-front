import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth-context';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isAuthenticated = signal<boolean>(false);

  constructor(private readonly authService: AuthService,
    private readonly router: 
  ) {
    this.authService.isAuthenticated$.subscribe(this.onAuthenticationChange);
  }

  private onAuthenticationChange = (isAuthenticated: boolean) => {
    this.isAuthenticated.set(isAuthenticated);
  };

  async login() {
    await this.authService.login();
    this
  }

  async logout() {
    await this.authService.logout();
  }
}
