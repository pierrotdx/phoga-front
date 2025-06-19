import { GallerySectionComponent } from './gallery-section.component';
import { GallerySectionTestUtils } from './gallery-section.test-utils';

describe('GallerySectionComponent', () => {
  let testUtils: GallerySectionTestUtils;
  let testedComponent: GallerySectionComponent;

  beforeEach(async () => {
    testUtils = new GallerySectionTestUtils();
    await testUtils.globalBeforeEach();
    testedComponent = testUtils.getTestedComponent();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
  });

  it('should display the gallery-navigation component', () => {
    const galleryNavigation = testUtils.queryByCss('app-gallery-nav');
    expect(galleryNavigation).toBeTruthy();
  });

  it('should display the photos of the selected gallery', () => {
    const photosDisplay = testUtils.queryByCss('lib-gallery');
    expect(photosDisplay).toBeTruthy();
  });
});
