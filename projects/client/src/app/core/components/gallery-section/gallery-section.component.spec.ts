import { GallerySectionTestUtils } from './gallery-section.test-utils';

describe('GalleryComponent', () => {
  let testUtils: GallerySectionTestUtils;

  beforeEach(async () => {
    testUtils = new GallerySectionTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
  });
});
