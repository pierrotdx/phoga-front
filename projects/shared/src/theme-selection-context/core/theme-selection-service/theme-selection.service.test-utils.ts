import { TestBed } from '@angular/core/testing';
import { ThemeSelectionService } from './theme-selection.service';
import { Theme } from '../models';

export class ThemeSelectionServiceTestUtils {
  private testedService!: ThemeSelectionService;

  createService(): ThemeSelectionService {
    TestBed.configureTestingModule({});
    this.testedService = TestBed.inject(ThemeSelectionService);
    return this.testedService;
  }

  getDefaultTheme(): Theme {
    return this.testedService['getDefaultTheme']();
  }

  fakeTheme(theme: Theme): void {
    this.testedService.theme.set(theme);
  }

  flushEffects(): void {
    TestBed.flushEffects();
  }

  fakeSystemPreferredThemeToBeDark(isDarkSystemPreferredTheme: boolean): void {
    const fakeMediaQuery = jasmine.createSpyObj<MediaQueryList>(
      'MediaQueryList',
      [],
      { matches: isDarkSystemPreferredTheme }
    );
    spyOn(window, 'matchMedia').and.returnValue(fakeMediaQuery);
  }

  getThemeKeyInLocalStorage(): string {
    return 'theme';
  }

  getHtmlDocThemeAttribute(): string | null {
    const attribute = this.testedService['themeAttr'];
    return document.documentElement.getAttribute(attribute);
  }
}
