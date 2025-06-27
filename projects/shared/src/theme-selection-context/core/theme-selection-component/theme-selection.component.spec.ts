import { DebugElement } from '@angular/core';
import { ThemeSelectionComponentTestUtils } from './theme-selection.component.test-utils';
import { Theme } from '../models';

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

  describe('the theme-selection form', () => {
    it('should be displayed', () => {
      const form = testUtils.getForm()?.nativeElement as HTMLFormElement;
      expect(form).toBeTruthy();
    });

    const themes = Object.values(Theme);
    themes.forEach((theme) => {
      it(`should have a "${theme}" option`, () => {
        const lightOption = testUtils.getFormOption(theme)
          ?.nativeElement as HTMLInputElement;
        expect(lightOption).toBeTruthy();
      });
    });

    describe('by default', () => {
      let defaultServiceTheme: Theme;

      beforeEach(() => {
        defaultServiceTheme = testUtils.getDefaultThemeSelectionServieTheme();
      });

      it("should have selected the theme-selection service's theme", () => {
        const select = testUtils.getSelect().nativeElement as HTMLSelectElement;
        const defaultFormTheme = select.value;
        const expectedTheme = defaultFormTheme;
        expect(defaultFormTheme).toBe(expectedTheme);
      });
    });

    describe('when an option is selected', () => {
      let option: DebugElement;
      const optionValue = Theme.Dark;
      let selectSpy: jasmine.Spy;

      beforeEach(() => {
        selectSpy = testUtils.getSelectSpy();
        selectSpy.calls.reset();

        option = testUtils.getFormOption(optionValue);
      });

      it('should update the theme-selection service with the selected option', () => {
        const optionElt = option.nativeElement as HTMLOptionElement;

        const select = testUtils.getSelect();
        select.triggerEventHandler('change', {
          target: optionElt,
        });

        const expectedValue = optionElt.value;
        expect(selectSpy).toHaveBeenCalledOnceWith(expectedValue);
      });
    });
  });
});
