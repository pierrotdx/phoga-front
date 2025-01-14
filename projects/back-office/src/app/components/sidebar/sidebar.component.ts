import { Component, signal } from '@angular/core';
import { AuthComponent } from '@back-office/auth-context';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationComponent, AuthComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {}
