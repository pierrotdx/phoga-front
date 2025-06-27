import { TestBed } from '@angular/core/testing';
import { ThemeSelectionService } from './theme-selection.service';
import { Theme } from '../models';

export class ThemeSelectionServiceTestUtils {
  private testedService!: ThemeSelectionService;

  createComponent(): ThemeSelectionService {
    TestBed.configureTestingModule({});
    this.testedService = TestBed.inject(ThemeSelectionService);
    return this.testedService;
  }

  getDefaultTheme(): Theme {
    return this.testedService['getDefaultTheme']();
  }

  fakeTheme(theme: Theme): void {
    this.testedService['theme'] = theme;
  }

  getThemeKeyInLocalStorage(): string {
    return 'theme';
  }

  getHtmlDocThemeAttribute(): string | null {
    const attribute = this.testedService['themeAttr'];
    return document.documentElement.getAttribute(attribute);
  }
}
