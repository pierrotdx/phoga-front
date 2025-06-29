import { ThemeSelectionComponentTestUtils } from './theme-selection.component.test-utils';
import { Theme, ThemeIcon } from '../models';
import { ThemeSelectionComponent } from './theme-selection.component';

describe('ThemeSelectionComponent', () => {
  let testUtils: ThemeSelectionComponentTestUtils;

  beforeEach(async () => {
    testUtils = new ThemeSelectionComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  it("should by default have its theme matching the theme-selection service's theme", () => {
    const testedComponent = testUtils.getTestedComponent();
    const defaultTheme = testedComponent.theme();
    const expectedTheme = testUtils.getServiceTheme();
    expect(defaultTheme).toBe(expectedTheme);
  });

  describe('the theme button', () => {
    let defaultServiceTheme: Theme;

    beforeEach(() => {
      defaultServiceTheme = testUtils.getDefaultThemeSelectionServieTheme();
    });

    it('should be displayed', () => {
      const themeButton = testUtils.getThemeButton();
      expect(themeButton.nativeElement).toBeTruthy();
    });

    const themes = Object.values(Theme);
    themes.forEach((theme) => {
      describe(`when the them is "${theme}"`, () => {
        let testedComponent: ThemeSelectionComponent;
        const expectedTheme = theme === Theme.Dark ? Theme.Light : Theme.Dark;

        beforeEach(() => {
          testedComponent = testUtils.getTestedComponent();
          testedComponent.theme.set(theme);
        });

        it(`should display the "${expectedTheme}" icon`, () => {
          const icon = testedComponent.icon();
          const expectedDisplayedIcon =
            expectedTheme === Theme.Dark ? ThemeIcon.Dark : ThemeIcon.Light;
          expect(icon).toBe(expectedDisplayedIcon);
        });
      });
    });

    describe('when clicked on', () => {
      let serviceThemeSpy: jasmine.Spy;

      beforeEach(async () => {
        serviceThemeSpy = testUtils.getServiceThemeSpy();
        serviceThemeSpy.calls.reset();

        const themeButton = testUtils.getThemeButton();
        (themeButton.nativeElement as HTMLButtonElement).click();

        testUtils.detectChanges();
        await testUtils.whenStable();
      });

      it('should update the theme of the theme-selection service', () => {
        const expectedValue =
          defaultServiceTheme === Theme.Light ? Theme.Dark : Theme.Light;
        expect(serviceThemeSpy).toHaveBeenCalledOnceWith(expectedValue);
      });
    });
  });
});
