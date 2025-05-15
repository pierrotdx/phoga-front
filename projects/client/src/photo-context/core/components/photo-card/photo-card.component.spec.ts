import { IGalleryPhotos, Photo } from '@shared/photo-context';
import { PhotoCardComponentTestUtils } from './photo-card.component.test-utils';
import { Buffer } from 'buffer';

describe('PhotoCardComponent', () => {
  let testUtils: PhotoCardComponentTestUtils;

  beforeEach(async () => {
    testUtils = new PhotoCardComponentTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', async () => {
    await testUtils.createComponent();

    const testedComponent = testUtils.getTestedComponent();
    expect(testedComponent).toBeTruthy();
  });

  describe('when there is a photo to display', () => {
    const fakePhoto = new Photo('photo-id', {
      imageBuffer: Buffer.from('fake image'),
    });
    const fakeGalleryPhotos: IGalleryPhotos = {
      all: [fakePhoto],
      lastBatch: [fakePhoto],
    };

    beforeEach(async () => {
      testUtils.simulateGalleryPhotos(fakeGalleryPhotos);
      testUtils.simulatePhotoId(fakeGalleryPhotos.all[0]._id);
      await testUtils.createComponent();
    });

    it('should display the photo-image component', () => {
      const photoImageComponent = testUtils.getPhotoImageComponent();

      expect(photoImageComponent).toBeTruthy();
    });

    it('should display the photo-metadata component', () => {
      const photoMetadataComponent = testUtils.getPhotoMetadataComponent();

      expect(photoMetadataComponent).toBeTruthy();
    });

    it('should not display the detailed view by default', () => {
      const showDetailedView = testUtils.getShowDetailedView();
      const isDisplayingDetailedView = testUtils.isDisplayingDetailedView();

      expect(showDetailedView).toBeFalse();
      expect(isDisplayingDetailedView).toBeFalse();
    });

    describe('when clicking on the expand icon', () => {
      beforeEach(() => {
        testUtils.clickOnExpandIcon();
      });

      it('should display the detailed view', () => {
        const showDetailedView = testUtils.getShowDetailedView();
        const isDisplayingDetailedView = testUtils.isDisplayingDetailedView();

        expect(showDetailedView).toBeTrue();
        expect(isDisplayingDetailedView).toBeTrue();
      });

      it('should select the photo in the gallery', () => {
        const gallerySpy = testUtils.getGallerySelectSpy();
        const expectedSelectedPhotoId = fakePhoto._id;

        expect(gallerySpy).toHaveBeenCalledOnceWith(expectedSelectedPhotoId);
      });

      describe('when the detailed view is closed', () => {
        beforeEach(() => {
          testUtils.simulateCloseDetailedView();
        });

        it('should deselect the photo in the gallery', () => {
          const deselectSpy = testUtils.getGalleryDeselectSpy();

          expect(deselectSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
