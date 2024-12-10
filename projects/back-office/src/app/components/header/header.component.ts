import { Component, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../../auth-context';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnDestroy {
  isAuthenticated = signal<boolean>(false);

  private readonly isAuthenticatedSub: Subscription;

  constructor(private readonly authService: AuthService) {
    this.isAuthenticatedSub = this.authService.isAuthenticated$.subscribe(
      this.onAuthenticationChange
    );
  }

  ngOnDestroy(): void {
    this.isAuthenticatedSub.unsubscribe();
  }

  private onAuthenticationChange = (isAuthenticated: boolean) => {
    this.isAuthenticated.set(isAuthenticated);
  };

  async logout() {
    await this.authService.logout();
  }
}
