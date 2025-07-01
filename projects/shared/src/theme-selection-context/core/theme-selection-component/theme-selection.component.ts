import { Component, computed, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Theme, ThemeIcon } from '../models';
import { ThemeSelectionService } from '../theme-selection-service/theme-selection.service';
import { MaterialIconComponent } from '../../../material-icon-component';

@Component({
  selector: 'lib-theme-selection',
  imports: [FormsModule, MaterialIconComponent],
  templateUrl: './theme-selection.component.html',
  styleUrl: './theme-selection.component.scss',
})
export class ThemeSelectionComponent {
  readonly Theme = Theme;

  readonly theme: WritableSignal<Theme>;
  readonly icon: Signal<ThemeIcon>;

  constructor(private readonly themeSelectionService: ThemeSelectionService) {
    this.theme = this.themeSelectionService.theme;
    this.icon = computed<ThemeIcon>(this.computeIcon);
  }

  private readonly computeIcon = (): ThemeIcon =>
    this.themeSelectionService.theme() === Theme.Dark
      ? ThemeIcon.Light
      : ThemeIcon.Dark;

  changeTheme() {
    const theme = this.theme() === Theme.Dark ? Theme.Light : Theme.Dark;
    this.theme.set(theme);
  }
}
