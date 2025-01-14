import { Component, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationComponent } from '../navigation/navigation.component';
import { LoginPageComponent } from '@back-office/app/pages';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    LoginPageComponent,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  isAuthenticated = signal<boolean>(false);
  hideMenu = signal<boolean>(false);

  isMobile = signal<boolean>(true);
  private mobileQuery!: MediaQueryList;

  constructor(private readonly mediaMatcher: MediaMatcher) {
    this.setupIsMobile();
  }

  private setupIsMobile(): void {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this.isMobile.set(this.mobileQuery.matches);
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  private mobileQueryListener = () => {
    this.isMobile.set(this.mobileQuery.matches);
  };

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  toggleMenu(): void {
    const hideMenu = this.hideMenu();
    this.hideMenu.set(!hideMenu);
  }
}
