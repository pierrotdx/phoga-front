import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Theme, IThemeSelectionService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ThemeSelectionService implements IThemeSelectionService {
  private readonly themeAttr = 'theme';
  private readonly storageKey = 'theme';
  readonly theme: WritableSignal<Theme>;

  constructor() {
    effect(this.onThemeChange);
    const defaultTheme = this.getDefaultTheme();
    this.theme = signal<Theme>(defaultTheme);
  }

  private getDefaultTheme(): Theme {
    const storageTheme = localStorage.getItem(this.storageKey) as Theme;
    if (storageTheme) {
      return storageTheme;
    }
    return this.prefersDarkTheme() ? Theme.Dark : Theme.Light;
  }

  private prefersDarkTheme(): boolean {
    const query = '(prefers-color-scheme: dark)';
    return window.matchMedia(query).matches;
  }

  private onThemeChange = (): void => {
    const theme = this.theme();
    this.storeThemeInLocalStorage(theme);
    this.activateTheme(theme);
  };

  private storeThemeInLocalStorage(theme: Theme): void {
    localStorage.setItem(this.storageKey, theme);
  }

  private activateTheme(theme: Theme): void {
    document.documentElement.setAttribute(this.themeAttr, theme);
  }
}
