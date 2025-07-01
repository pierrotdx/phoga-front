import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  ENDPOINTS_TOKEN,
  IEndpoints,
  EndpointId,
} from '@back-office/endpoints-context';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isAuthenticated = signal<boolean>(false);
  @Output() isAuthenticatedChange = new EventEmitter<boolean>();

  readonly restrictedUrl: string;
  private readonly accessTokenSub: Subscription;

  constructor(
    private readonly authService: AuthService,
    @Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints
  ) {
    this.accessTokenSub = this.authService.accessToken$.subscribe(
      this.onAuthChange
    );
    this.restrictedUrl = this.endpoints.getRelativePath(EndpointId.Restricted);
  }

  ngOnInit(): void {
    this.updateIsAuthenticated();
  }

  ngOnDestroy(): void {
    this.accessTokenSub.unsubscribe();
  }

  private readonly onAuthChange = () => {
    this.updateIsAuthenticated();
  };

  async login() {
    try {
      await this.authService.login();
      this.updateIsAuthenticated();
    } catch (err) {
      console.error(err);
    }
  }

  private updateIsAuthenticated() {
    const isAuth = this.authService.isAuthenticated();
    this.isAuthenticated.set(isAuth);
    this.isAuthenticatedChange.emit(isAuth);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.updateIsAuthenticated();
    } catch (err) {
      console.error(err);
    }
  }
}
