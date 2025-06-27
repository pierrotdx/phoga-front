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
    testedService = testUtils.createComponent();

    expect(testedService).toBeTruthy();
  });

  describe('select', () => {
    const initTheme = Theme.Light;

    beforeEach(() => {
      testedService = testUtils.createComponent();
      testUtils.fakeTheme(initTheme);
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

      const key = testUtils.getThemeKeyInLocalStorage();
      expect(localStorage[key]).toBe(expectedTheme);
    });

    it('should update the "theme" attribute of the HTML document', () => {
      // dark theme
      let expectedTheme = Theme.Dark;

      testedService.select(expectedTheme);

      let htmlDocThemeAttribute = testUtils.getHtmlDocThemeAttribute();
      expect(htmlDocThemeAttribute).toBe(expectedTheme);

      // light theme
      expectedTheme = Theme.Light;

      testedService.select(expectedTheme);

      htmlDocThemeAttribute = testUtils.getHtmlDocThemeAttribute();
      expect(htmlDocThemeAttribute).toBe(expectedTheme);
    });
  });

  describe('theme$', () => {
    describe('by default', () => {
      describe('when there is no theme stored in the local storage', () => {
        beforeEach(() => {
          testedService = testUtils.createComponent();
        });

        it('should have a default value', async () => {
          const expectedTheme = testUtils.getDefaultTheme();

          const theme = testedService.getTheme();

          expect(theme).toBe(expectedTheme);
        });
      });

      describe('when there is a theme stored in the local storage', () => {
        const storedTheme = Theme.Dark;

        beforeEach(() => {
          const key = testUtils.getThemeKeyInLocalStorage();
          localStorage.setItem(key, storedTheme);

          testedService = testUtils.createComponent();
        });

        it('should have a the value from the local storage', async () => {
          const expectedTheme = storedTheme;

          const theme = testedService.getTheme();

          expect(theme).toBe(expectedTheme);
        });
      });
    });
  });
});
