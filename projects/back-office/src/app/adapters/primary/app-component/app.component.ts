import { Component, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent, LoginPageComponent } from '../../../core';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LoginPageComponent, MatIconModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  isAuthenticated = signal<boolean>(false);
  hideMenu = signal<boolean>(false);

  private readonly routeSub: Subscription;

  constructor(private readonly router: Router) {
    const navigationEnd$ = this.router.events.pipe(
      filter((e) => e.type === EventType.NavigationEnd)
    );
    this.routeSub = navigationEnd$.subscribe(() => {
      this.hideMenu.set(true);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  toggleMenu(): void {
    const hideMenu = this.hideMenu();
    this.hideMenu.set(!hideMenu);
  }
}
