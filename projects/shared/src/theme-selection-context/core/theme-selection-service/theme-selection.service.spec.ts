import { ThemeSelectionServiceTestUtils } from './theme-selection.service.test-utils';
import { IThemeSelectionService, Theme } from '../models';

describe('ThemeSelectionServiceService', () => {
  let testUtils: ThemeSelectionServiceTestUtils;
  let testedService: IThemeSelectionService;

  beforeEach(() => {
    testUtils = new ThemeSelectionServiceTestUtils();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    testedService = testUtils.createService();

    expect(testedService).toBeTruthy();
  });

  describe('select()', () => {
    const initTheme = Theme.Light;

    beforeEach(() => {
      testedService = testUtils.createService();
      testUtils.fakeTheme(initTheme);
      testUtils.flushEffects();
    });

    it('should change the selected theme', async () => {
      const expectedTheme = Theme.Dark;

      testedService.select(expectedTheme);

      const theme = testedService.getTheme();
      expect(theme).toBe(expectedTheme);
    });

    it('should update the local storage with the selected theme', () => {
      const expectedTheme = Theme.Dark;

      testedService.select(expectedTheme);
      testUtils.flushEffects();

      const key = testUtils.getThemeKeyInLocalStorage();
      expect(localStorage[key]).toBe(expectedTheme);
    });

    it('should update the "theme" attribute of the HTML document', () => {
      // switch to dark theme
      let expectedTheme = Theme.Dark;

      testedService.select(expectedTheme);
      testUtils.flushEffects();

      let htmlDocThemeAttribute = testUtils.getHtmlDocThemeAttribute();
      expect(htmlDocThemeAttribute).toBe(expectedTheme);

      // switch to light theme
      expectedTheme = Theme.Light;

      testedService.select(expectedTheme);
      testUtils.flushEffects();

      htmlDocThemeAttribute = testUtils.getHtmlDocThemeAttribute();
      expect(htmlDocThemeAttribute).toBe(expectedTheme);
    });
  });

  describe('getTheme()', () => {
    describe('by default', () => {
      describe('when there is no theme stored in the local storage', () => {
        describe('when the system-preferred theme is "dark"', () => {
          const systemPreferredTheme = 'dark';

          beforeEach(() => {
            testUtils.fakeSystemPreferredThemeToBeDark(true);
            testedService = testUtils.createService();
          });

          it('should set the theme to "dark"', () => {
            const expectedTheme = systemPreferredTheme;

            const theme = testedService.getTheme();

            expect(theme).toBe(expectedTheme);
          });
        });

        describe('when the system-preferred theme is not "dark"', () => {
          beforeEach(() => {
            testUtils.fakeSystemPreferredThemeToBeDark(false);
            testedService = testUtils.createService();
          });

          it('should set the theme to "light"', () => {
            const expectedTheme = Theme.Light;

            const theme = testedService.getTheme();

            expect(theme).toBe(expectedTheme);
          });
        });
      });

      describe('when there is a theme stored in the local storage', () => {
        const storedTheme = Theme.Dark;

        beforeEach(() => {
          const key = testUtils.getThemeKeyInLocalStorage();
          localStorage.setItem(key, storedTheme);

          testedService = testUtils.createService();
        });

        it('should take the local-storage value', async () => {
          const expectedTheme = storedTheme;

          const theme = testedService.getTheme();

          expect(theme).toBe(expectedTheme);
        });
      });
    });
  });
});
