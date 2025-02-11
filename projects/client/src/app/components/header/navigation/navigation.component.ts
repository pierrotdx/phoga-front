import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  showMenu = signal<boolean>(false);

  onMenuClick(): void {
    const showMenu = this.showMenu();
    this.showMenu.set(!showMenu);
  }
}
