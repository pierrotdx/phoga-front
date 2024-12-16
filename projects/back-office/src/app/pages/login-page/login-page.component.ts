import { Component, Inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth-context';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '../../endpoints-context';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnDestroy {
  isAuthenticated = signal<boolean>(false);

  private readonly isAuthenticatedSub: Subscription;

  constructor(
    @Inject(ENDPOINTS_TOKEN)
    private readonly endpoints: IEndpoints,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.isAuthenticatedSub = this.authService.isAuthenticated$.subscribe(
      this.onAuthenticationChange
    );
  }

  ngOnDestroy(): void {
    this.isAuthenticatedSub.unsubscribe();
  }

  private onAuthenticationChange = (isAuthenticated: boolean) => {
    this.isAuthenticated.set(isAuthenticated);
    if (isAuthenticated) {
      this.navigateToRestricted();
    }
  };

  private navigateToRestricted() {
    const redirectUrl = this.endpoints.getRelativePath(EndpointId.HomePage);
    this.router.navigate([redirectUrl]);
  }

  async login() {
    try {
      await this.authService.login();
    } catch (err) {
      console.error(err);
    }
  }
}
