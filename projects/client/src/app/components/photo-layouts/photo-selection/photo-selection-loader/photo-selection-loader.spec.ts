import { ISlide, ISwiperState } from '@shared/swiper-context';
import { GalleryServiceState } from '../gallery-service.fake';
import { PhotoSelectionLoaderTestUtils } from './photo-selection-loader.test-utils';
import { IPhoto } from '@shared/photo-context';

describe('PhotoSelectionLoader', () => {
  let testUtils: PhotoSelectionLoaderTestUtils;

  let galleryServiceInitState: GalleryServiceState;
  let nbSlides: number = 4;

  beforeEach(() => {
    testUtils = new PhotoSelectionLoaderTestUtils();
  });

  describe('getInitPhotos', () => {
    const nbInitPhotos = [0, nbSlides - 1, nbSlides, nbSlides + 1];
    nbInitPhotos.forEach((nbPhotos) => {
      it(`should return a number of photos greater than or equal to the number of slides (${nbPhotos} photos, ${nbSlides} slides)`, async () => {
        galleryServiceInitState = { nbPhotos };
        testUtils.globalBeforeEach({ nbSlides, galleryServiceInitState });

        await testUtils.expectNbOfInitPhotosToBeAtLeast(nbSlides);
      });
    });
  });

  describe('onSwiperStateChange', () => {
    let loadPhotosSpy: jasmine.Spy;
    let swiperState: ISwiperState<IPhoto>;
    let slides: ISlide<IPhoto>[];

    beforeEach(() => {
      slides = testUtils.generateDumbSlides(nbSlides);
    });

    describe('when the swiper is still far from the end of loaded photos', () => {
      beforeEach(() => {
        galleryServiceInitState = { nbPhotos: 2 * nbSlides };
        testUtils.globalBeforeEach({ nbSlides, galleryServiceInitState });

        swiperState = {
          activeItemIndex: 0,
          slides,
        };
      });

      describe('photo loading', () => {
        beforeEach(() => {
          loadPhotosSpy = testUtils.getLoadPhotosSpy();
          loadPhotosSpy.calls.reset();
        });

        it('should not occur', () => {
          testUtils.onSwiperStateChange(swiperState);
          expect(loadPhotosSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the swiper is getting close to the end of loaded photos', () => {
      beforeEach(() => {
        galleryServiceInitState = { nbPhotos: nbSlides + 1 };
        testUtils.globalBeforeEach({ nbSlides, galleryServiceInitState });

        swiperState = {
          activeItemIndex: 0,
          slides,
        };
      });

      describe('photo loading', () => {
        beforeEach(() => {
          loadPhotosSpy = testUtils.getLoadPhotosSpy();
          loadPhotosSpy.calls.reset();
        });

        describe('when there are more photos to load', () => {
          beforeEach(() => {
            testUtils.stubHasMoreToLoad(true);
          });

          it('should trigger photos preloading', () => {
            testUtils.onSwiperStateChange(swiperState);
            expect(loadPhotosSpy).toHaveBeenCalledTimes(1);
          });
        });

        describe('when there are no more photos to load', () => {
          beforeEach(() => {
            testUtils.stubHasMoreToLoad(false);
          });

          it('should not trigger photos preloading', () => {
            testUtils.onSwiperStateChange(swiperState);
            expect(loadPhotosSpy).not.toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
