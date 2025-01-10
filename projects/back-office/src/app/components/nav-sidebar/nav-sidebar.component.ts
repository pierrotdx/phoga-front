import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth-context';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-sidebar',
  imports: [],
  templateUrl: './nav-sidebar.component.html',
})
export class NavSidebarComponent implements OnInit, OnDestroy {
  isAuthenticated = signal<boolean>(false);

  private readonly accessTokenSub: Subscription;

  constructor(private readonly authService: AuthService) {
    this.accessTokenSub = this.authService.accessToken$.subscribe(
      this.onAuthChange
    );
  }

  ngOnInit(): void {
    this.updateIsAuthenticated();
  }

  ngOnDestroy(): void {
    this.accessTokenSub.unsubscribe();
  }

  private onAuthChange = () => {
    this.updateIsAuthenticated();
  };

  private updateIsAuthenticated() {
    const isAuth = this.authService.isAuthenticated();
    this.isAuthenticated.set(isAuth);
  }
  async logout() {
    await this.authService.logout();
  }
}
