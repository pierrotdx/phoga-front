import { Component } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { ThemeSelectionComponent } from '@shared/theme-selection-context';

@Component({
  selector: 'app-header',
  imports: [NavigationComponent, ThemeSelectionComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
