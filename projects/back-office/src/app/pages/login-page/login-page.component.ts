import {
  Component,
  effect,
  Inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
export class LoginPageComponent implements OnInit, OnDestroy {
  isAuthenticated = signal<boolean>(false);

  private readonly accessTokenSub: Subscription;

  constructor(
    @Inject(ENDPOINTS_TOKEN)
    private readonly endpoints: IEndpoints,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.accessTokenSub = this.authService.accessToken$.subscribe(() => {
      this.updateIsAuthenticated();
    });
  }

  ngOnInit(): void {
    this.updateIsAuthenticated();
  }

  ngOnDestroy(): void {
    this.accessTokenSub.unsubscribe();
  }

  private updateIsAuthenticated() {
    const isAuth = this.authService.isAuthenticated();
    this.isAuthenticated.set(isAuth);
    if (isAuth) {
      this.navigateToRestricted();
    }
  }

  private navigateToRestricted() {
    const redirectUrl = this.endpoints.getRelativePath(EndpointId.Restricted);
    this.router.navigate([redirectUrl]);
  }

  async login() {
    try {
      await this.authService.login();
      this.updateIsAuthenticated();
    } catch (err) {
      console.error(err);
    }
  }
}
