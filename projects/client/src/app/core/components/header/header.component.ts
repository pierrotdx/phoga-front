import { Component } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-header',
  imports: [NavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
