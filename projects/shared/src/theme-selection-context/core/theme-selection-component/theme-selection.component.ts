import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme } from '../models';
import { ThemeSelectionService } from '@shared/public-api';

@Component({
  selector: 'lib-theme-selection',
  imports: [FormsModule],
  templateUrl: './theme-selection.component.html',
  styleUrl: './theme-selection.component.scss',
})
export class ThemeSelectionComponent {
  readonly Theme = Theme;

  theme: string = '';

  constructor(private readonly themeSelectionService: ThemeSelectionService) {
    this.theme = this.themeSelectionService.getTheme();
  }

  onThemeChange = () => {
    this.themeSelectionService.select(this.theme as Theme);
  };
}
