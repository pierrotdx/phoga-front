import { Component, EventEmitter, Inject, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthComponent } from '../../../../auth-context';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '../../../../endpoints-context';

@Component({
  selector: 'app-login-page',
  imports: [AuthComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  isAuthenticated = signal<boolean>(false);
  @Output() isAuthenticatedChange = new EventEmitter<boolean>(false);

  constructor(
    @Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints,
    private readonly router: Router
  ) {}

  private navigateToRestricted() {
    const redirectUrl = this.endpoints.getRelativePath(EndpointId.Restricted);
    this.router.navigate([redirectUrl]);
  }

  onAuthChange(isAuth: boolean) {
    this.isAuthenticatedChange.emit(isAuth);
    if (isAuth) {
      this.navigateToRestricted();
    }
  }
}
