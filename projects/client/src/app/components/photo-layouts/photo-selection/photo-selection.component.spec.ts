import { DebugElement } from '@angular/core';
import { PhotoSelectionTestUtils } from './photo-selection.test-utils';
import { IPhoto } from '@shared/photo-context';
import { fakeAsync, tick } from '@angular/core/testing';
import { GalleryServiceState } from './gallery-service.fake';
import { ISlide, ISwiperState } from '@shared/swiper-context';

describe('PhotoSelectionComponent', () => {
  let testUtils: PhotoSelectionTestUtils;
  let galleryServiceInitState: GalleryServiceState;

  beforeEach(async () => {
    galleryServiceInitState = { nbPhotos: 10 };
    testUtils = new PhotoSelectionTestUtils();
    await testUtils.globalBeforeEach(galleryServiceInitState);
  });

  it('should create', async () => {
    testUtils.expectComponentToBeCreated();
  });

  describe('the component view', () => {
    describe('before initial photos loading', () => {
      it('should display a loading placeholder', () => {
        const placeHolderElement = testUtils.getLoadingPlaceHolderElement();
        expect(placeHolderElement).toBeTruthy();
      });

      it('should not display the swiper', () => {
        const swiperElement = testUtils.getSwiperElement();
        expect(swiperElement).toBeNull();
      });
    });

    describe('after initial photos loading', () => {
      beforeEach(async () => {
        await testUtils.waitInitPhotosLoading();
      });

      it('should not display the loading placeholder', () => {
        const placeHolderElement = testUtils.getLoadingPlaceHolderElement();
        expect(placeHolderElement).toBeNull();
      });

      it('should display the swiper', () => {
        const swiperElement = testUtils.getSwiperElement();
        expect(swiperElement).toBeTruthy();
      });
    });
  });

  describe('on selectNext$ event', () => {
    let selectPhotoSpy: jasmine.Spy;

    afterEach(() => {
      selectPhotoSpy.calls.reset();
    });

    describe('in regular case', () => {
      beforeEach(async () => {
        galleryServiceInitState.selectedPhotoIndex = 0;
        testUtils = await restartTestUtils(testUtils, galleryServiceInitState);
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
        testUtils.setSelectNextInput();
        await testUtils.waitInitPhotosLoading();
      });

      it('should select the next photo', async () => {
        testUtils.emitSelectNext();

        const expectedPhotoIndex =
          galleryServiceInitState.selectedPhotoIndex! + 1;
        expect(selectPhotoSpy).toHaveBeenCalledOnceWith(expectedPhotoIndex);
      });
    });

    describe('when the last photo is already selected', () => {
      beforeEach(async () => {
        galleryServiceInitState.selectedPhotoIndex =
          galleryServiceInitState.nbPhotos - 1;
        testUtils = await restartTestUtils(testUtils, galleryServiceInitState);
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
        testUtils.setSelectNextInput();
        await testUtils.waitInitPhotosLoading();
      });

      it('should not change the selected photo', async () => {
        testUtils.emitSelectNext();

        expect(selectPhotoSpy).not.toHaveBeenCalled();
      });
    });

    describe('when no photo is selected', () => {
      beforeEach(async () => {
        galleryServiceInitState.selectedPhotoIndex = undefined;
        testUtils = await restartTestUtils(testUtils, galleryServiceInitState);
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
        testUtils.setSelectNextInput();
        await testUtils.waitInitPhotosLoading();
      });

      it('should select the first photo', () => {
        testUtils.emitSelectNext();

        const expectedPhotoIndex = 0;
        expect(selectPhotoSpy).toHaveBeenCalledOnceWith(expectedPhotoIndex);
      });
    });
  });

  describe('on selectPrevious$ event', () => {
    let selectPhotoSpy: jasmine.Spy;

    afterEach(() => {
      selectPhotoSpy.calls.reset();
    });

    describe('in regular case', () => {
      beforeEach(async () => {
        testUtils.setSelectPreviousInput();
        await testUtils.waitInitPhotosLoading();
        galleryServiceInitState.selectedPhotoIndex = 1;
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
      });

      it('should select the previous photo', () => {
        testUtils.emitSelectPrevious();

        const expectedPhotoIndex =
          galleryServiceInitState.selectedPhotoIndex! - 1;
        expect(selectPhotoSpy).toHaveBeenCalledOnceWith(expectedPhotoIndex);
      });
    });

    describe('when the first photo is already selected', () => {
      beforeEach(async () => {
        galleryServiceInitState.selectedPhotoIndex = 0;
        testUtils = await restartTestUtils(testUtils, galleryServiceInitState);
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
        testUtils.setSelectPreviousInput();
        await testUtils.waitInitPhotosLoading();
      });

      it('should not change the selected photo', () => {
        testUtils.emitSelectPrevious();

        expect(selectPhotoSpy).not.toHaveBeenCalled();
      });
    });

    describe('when no photo is selected', () => {
      beforeEach(async () => {
        galleryServiceInitState.selectedPhotoIndex = undefined;
        testUtils = await restartTestUtils(testUtils, galleryServiceInitState);
        selectPhotoSpy = testUtils.getSelectPhotoSpy();
        testUtils.setSelectPreviousInput();
        await testUtils.waitInitPhotosLoading();
      });

      it('should select the first photo', () => {
        testUtils.emitSelectPrevious();

        const expectedPhotoIndex = 0;
        expect(selectPhotoSpy).toHaveBeenCalledOnceWith(expectedPhotoIndex);
      });
    });
  });

  describe('selectPhoto', () => {
    let selectPhotoSpy: jasmine.Spy;
    let selectedPhotoIndex = 0;
    let photoToSelect: IPhoto;

    beforeEach(async () => {
      selectPhotoSpy = testUtils.getSelectPhotoSpy();
      await testUtils.waitInitPhotosLoading();
    });

    afterEach(() => {
      selectPhotoSpy.calls.reset();
    });

    it('should be called when clicking on a photo', fakeAsync(() => {
      const photos = testUtils.getInitPhotos();
      photoToSelect = photos[selectedPhotoIndex];

      const slide: DebugElement = testUtils.getSlideElement(selectedPhotoIndex);
      const expectedPhotoIndex = selectedPhotoIndex;

      slide.nativeElement.click();
      tick();

      expect(selectPhotoSpy).toHaveBeenCalledOnceWith(expectedPhotoIndex);
    }));

    it('should swipe to the selected item', () => {
      const swipeToItemSpy = testUtils.getSwipeToItemSpy();

      const expectedSelectedPhotoIndex = 3;
      testUtils.selectPhotoByIndex(expectedSelectedPhotoIndex);

      expect(swipeToItemSpy).toHaveBeenCalledOnceWith(
        expectedSelectedPhotoIndex
      );
    });
  });

  describe('onSwiperStateChange', () => {
    let swiperState: ISwiperState<IPhoto>;

    beforeEach(() => {
      swiperState = {
        activeItemIndex: 0,
        slides: [] as ISlide<IPhoto>[],
      };
    });

    it("should call photo-loader's callback on swiper-state change", () => {
      const photoLoaderOnSwiperStateChangeSpy =
        testUtils.getPhotoLoaderOnSwiperStateChangeSpy();

      testUtils.onSwiperStateChange(swiperState);

      expect(photoLoaderOnSwiperStateChangeSpy).toHaveBeenCalledOnceWith(
        swiperState
      );
    });
  });

  describe('when new photos are loaded', () => {
    beforeEach(async () => {
      const size = 2;
      await testUtils.loadMorePhotos(size);
    });

    it('should add them to the swiper', () => {
      const addItemsSpy = testUtils.getAddItemsEmitterSpy();
      expect(addItemsSpy).toHaveBeenCalled();
    });
  });
});

const restartTestUtils = async (
  testUtils: PhotoSelectionTestUtils,
  galleryServiceInitState?: GalleryServiceState
): Promise<PhotoSelectionTestUtils> => {
  if (testUtils) {
    testUtils.resetTestingModule();
  }
  const utils = new PhotoSelectionTestUtils();
  await utils.globalBeforeEach(galleryServiceInitState);
  return utils;
};
