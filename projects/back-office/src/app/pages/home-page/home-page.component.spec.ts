import { Photo } from '@shared/photo-context';
import { HomePageTestUtils } from './home-page.test-utils';

describe('HomePageComponent', () => {
  let testUtils: HomePageTestUtils;

  beforeEach(async () => {
    testUtils = new HomePageTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    expect(testUtils.component).toBeTruthy();
  });

  describe('add-photo feature', () => {
    it('should have an anchor linking to the edit-photo form', () => {
      const anchorId = 'add-photo-anchor';
      const addPhotoAnchor = testUtils.getElementById(anchorId);
      expect(addPhotoAnchor).toBeDefined();
    });
  });

  describe('when photos are not loaded', () => {
    beforeEach(() => {
      testUtils.setPhotos(undefined);
    });

    describe('the loading spinner', () => {
      it('should be displayed', () => {
        const loadingSpinnerId = 'loading-spinner';
        const loadingSpinner = testUtils.getElementById(loadingSpinnerId);
        expect(loadingSpinner).toBeTruthy();
      });
    });

    describe('the photos container', () => {
      it('should not be displayed', () => {
        const photosContainerId = 'photos-container';
        const photosContainer = testUtils.getElementById(photosContainerId);
        expect(photosContainer).toBeFalsy();
      });
    });
  });

  describe('when photos are loaded', () => {
    beforeEach(() => {
      const photos = [new Photo('dumb photo 1'), new Photo('dumb photo 2')];
      testUtils.setPhotos(photos);
    });

    describe('the loading spinner', () => {
      it('should not be displayed', () => {
        const loadingSpinnerId = 'loading-spinner';
        const loadingSpinner = testUtils.getElementById(loadingSpinnerId);
        expect(loadingSpinner).toBeFalsy();
      });
    });

    describe('the photos container', () => {
      it('should be displayed', () => {
        const photosContainerId = 'photos-container';
        const photosContainer = testUtils.getElementById(photosContainerId);
        expect(photosContainer).toBeTruthy();
      });
    });
  });
});
