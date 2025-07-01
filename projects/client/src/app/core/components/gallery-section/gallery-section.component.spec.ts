import { GallerySectionTestUtils } from './gallery-section.test-utils';

describe('GallerySectionComponent', () => {
  let testUtils: GallerySectionTestUtils;

  beforeEach(async () => {
    testUtils = new GallerySectionTestUtils();
    await testUtils.globalBeforeEach();
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
