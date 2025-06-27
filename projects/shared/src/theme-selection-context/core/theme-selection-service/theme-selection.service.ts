import { Injectable } from '@angular/core';
import { Theme, IThemeSelectionService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ThemeSelectionService implements IThemeSelectionService {
  private readonly themeAttr = 'theme';
  private readonly storageKey = 'theme';
  private theme: Theme;

  constructor() {
    this.theme = this.getDefaultTheme();
    this.onThemeChange();
  }

  private getDefaultTheme(): Theme {
    const storageTheme = localStorage.getItem(this.storageKey) as Theme;
    return storageTheme || Theme.Light;
  }

  getTheme(): Theme {
    return this.theme;
  }

  select(theme: Theme): void {
    this.theme = theme;
    this.onThemeChange();
  }

  private onThemeChange(): void {
    this.storeThemeInLocalStorage();
    this.activateTheme();
  }

  private storeThemeInLocalStorage(): void {
    localStorage.setItem(this.storageKey, this.theme);
  }

  private activateTheme(): void {
    document.documentElement.setAttribute(this.themeAttr, this.theme);
  }
}
