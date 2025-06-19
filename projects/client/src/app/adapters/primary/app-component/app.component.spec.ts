import { AppComponentTestUtils } from './app.component.test-utils';

describe('AppComponent', () => {
  let testUtils: AppComponentTestUtils;

  beforeEach(async () => {
    testUtils = new AppComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create the app', () => {
    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  it('should init the gallery service', () => {
    const initGalleryServiceSpy = testUtils.getInitGalleryServiceSpy();
    expect(initGalleryServiceSpy).toHaveBeenCalledTimes(1);
  });

  describe('while the initialization is not finished', () => {
    it('should display the loading place holder', () => {
      const loadingPlaceHolder = testUtils.getLoadingPlaceHolder();
      expect(loadingPlaceHolder).toBeTruthy();
    });
  });

  describe('when the initialization is finished', () => {
    beforeEach(() => {
      testUtils.getTestedComponent().hasInit.set(true);
      testUtils.detectChanges();
    });

    it('should not display the loading place holder', () => {
      const loadingPlaceHolder = testUtils.getLoadingPlaceHolder();
      expect(loadingPlaceHolder).toBeFalsy();
    });
  });
});
