import { IGalleryPhotos, Photo } from '@shared/photo-context';
import { GalleryComponentTestUtils } from './gallery.component.test-utils';

describe('GalleryComponent', () => {
  let testUtils: GalleryComponentTestUtils;

  const dumbPhotos = [
    new Photo('photo-1'),
    new Photo('photo-2'),
    new Photo('photo-3'),
  ];
  const galleryPhotos: IGalleryPhotos = {
    all: dumbPhotos,
    lastBatch: dumbPhotos,
  };

  beforeEach(async () => {
    testUtils = new GalleryComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.createComponent();

    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe('when the input gallery is loading', () => {
    beforeEach(() => {
      testUtils.simulateGalleryLoading(true);
      testUtils.createComponent();
    });

    describe('when there is no photo to display', () => {
      it('should display only the loading place holder', () => {
        testUtils.expectOnlyLoadingPlaceHolderToBeDisplayed();
      });
    });

    describe('when there are photos to display', () => {
      beforeEach(() => {
        testUtils.simulateGalleryPhotos(galleryPhotos);
        testUtils.createComponent();
      });

      it('should be displayed after the displayed photos', () => {
        const loadingElt = testUtils.getLoadingPlaceHolder();
        const photosElt = testUtils.getPhotoStripCompElements();

        expect(loadingElt).toBeTruthy();
        expect(photosElt).toBeTruthy();
      });
    });
  });

  describe('when the input gallery is not loading', () => {
    beforeEach(() => {
      testUtils.simulateGalleryLoading(false);
    });

    it('should not display the loading place holder', () => {
      testUtils.createComponent();
      const loadingPlaceHolder = testUtils.getLoadingPlaceHolder();

      expect(loadingPlaceHolder).toBeFalsy();
    });

    describe('when there is no photo to show', () => {
      beforeEach(() => {
        testUtils.createComponent();
      });

      it('should display the empty-gallery place holder', () => {
        const emptyGalleryPlaceHolder = testUtils.getEmptyGalleryPlaceHolder();

        expect(emptyGalleryPlaceHolder).toBeTruthy();
      });
    });

    describe('when there are photos to display', () => {
      beforeEach(() => {
        testUtils.simulateGalleryPhotos(galleryPhotos);
        testUtils.createComponent();
      });

      it('should not show the empty-gallery place holder', () => {
        const emptyGalleryPlaceHolder = testUtils.getEmptyGalleryPlaceHolder();

        expect(emptyGalleryPlaceHolder).toBeFalsy();
      });

      it('should create strips of photos', () => {
        const photoStrips = testUtils.getPhotoStrips();

        expect(photoStrips.length).toBeGreaterThan(0);
      });

      it('should display the photo-strip component for each photo strips', () => {
        const expectedNbTimes = 2;

        const photoStripComponents = testUtils.getPhotoStripCompElements();
        expect(photoStripComponents.length).toBe(expectedNbTimes);
      });
    });
  });
});
