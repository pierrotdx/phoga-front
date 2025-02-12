import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  showMenu = signal<boolean>(false);

  onMenuClick(): void {
    const showMenu = this.showMenu();
    this.showMenu.set(!showMenu);
  }
}
