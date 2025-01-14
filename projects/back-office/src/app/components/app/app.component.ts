import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from '@back-office/app/pages';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LoginPageComponent, MatIconModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  isAuthenticated = signal<boolean>(false);
  hideMenu = signal<boolean>(false);

  constructor() {}

  toggleMenu(): void {
    const hideMenu = this.hideMenu();
    this.hideMenu.set(!hideMenu);
  }
}
