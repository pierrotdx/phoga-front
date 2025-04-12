import { Component } from '@angular/core';
import { AuthComponent } from '../../../../auth-context';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationComponent, AuthComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {}
