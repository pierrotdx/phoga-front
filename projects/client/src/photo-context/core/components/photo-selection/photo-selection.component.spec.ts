import { fakeAsync, tick } from '@angular/core/testing';
import { PhotoSelectionTestUtils } from './photo-selection.test-utils';
import { IPhoto, ISearchPhotoOptions, Photo } from '@shared/photo-context';
import { Observable, of } from 'rxjs';
import { ISearchResult } from '@shared/models';

describe('PhotoSelectionComponent', () => {
  let testUtils: PhotoSelectionTestUtils;

  const dumbPhotos = [
    new Photo('id-1'),
    new Photo('id-2'),
    new Photo('id-3'),
    new Photo('id-4'),
    new Photo('id-5'),
    new Photo('id-6'),
  ];

  beforeEach(async () => {
    testUtils = new PhotoSelectionTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', async () => {
    testUtils.createComponent();

    testUtils.expectComponentToBeCreated();
  });

  describe('when there is no preloaded photo', () => {
    it('should be loading a nb of photos matching the required nb of slides', async () => {
      testUtils.createComponent();
      testUtils.detectChanges();
      await testUtils.whenStable();

      const expectedSize = testUtils.getRequiredSlidesNb();
      const expectedOptions: ISearchPhotoOptions = { size: expectedSize };
      testUtils.expectPhotosLoadToHaveBeenCalledWith(expectedOptions);
    });
  });

  describe('when the nb of preloaded photos is lesser than the required nb of slides', () => {
    const nbPreloadPhotos = 2;
    const preloadPhotos = dumbPhotos.slice(0, nbPreloadPhotos);

    it('should be loading the required nb of slides', async () => {
      testUtils.createComponent();
      testUtils.simulatePhotosLoading({
        hits: preloadPhotos,
        totalCount: preloadPhotos.length * 2,
      });
      testUtils.getHasMorePhotosToLoadSpy().and.returnValue(true);
      testUtils.detectChanges();
      await testUtils.whenStable();

      const expectedSize = testUtils.getRequiredSlidesNb() - nbPreloadPhotos;
      const expectedFrom = preloadPhotos.length + 1;
      const expectedOptions: ISearchPhotoOptions = {
        size: expectedSize,
        from: expectedFrom,
      };

      testUtils.expectPhotosLoadToHaveBeenCalledWith(expectedOptions);
    });
  });

  describe('when initial photos are loading', () => {
    beforeEach(() => {
      testUtils.createComponent();
      testUtils.detectChanges();
    });

    it('should display a loading placeholder', () => {
      const placeHolder = testUtils.getLoadingPlaceHolder();
      expect(placeHolder).toBeTruthy();
    });
  });

  describe('when there is no loaded photos (empty batch)', () => {
    beforeEach(async () => {
      testUtils.createComponent();
      const searchResult: ISearchResult<IPhoto> = { hits: [], totalCount: 0 };
      await testUtils.simulatePhotosLoading(searchResult);
      await testUtils.whenStable();
      await testUtils.waitInitPhotosLoading();
    });

    it('should display a place holder indicating no photos are available', () => {
      const placeHolder = testUtils.getNoPhotosPlaceHolder();
      expect(placeHolder).toBeTruthy();
    });
  });

  describe('when there are loaded photos', () => {
    beforeEach(async () => {
      testUtils.createComponent();
      const searchResult: ISearchResult<IPhoto> = {
        hits: dumbPhotos,
        totalCount: dumbPhotos.length,
      };
      await testUtils.simulatePhotosLoading(searchResult);
      await testUtils.waitInitPhotosLoading();
    });

    it('should display the swiper', () => {
      const swiperElement = testUtils.getSwiperElement();
      expect(swiperElement).toBeTruthy();
    });

    describe('when a selectNext$ event is emitted', () => {
      beforeEach(async () => {
        testUtils.setSelectNextInput();
        testUtils.detectChanges();
      });

      it('should call the `gallery.selectNextPhoto()` method', async () => {
        const selectNextPhotoSpy = testUtils.getSelectNextPhotoSpy();
        selectNextPhotoSpy.calls.reset();

        testUtils.emitSelectNext();

        expect(selectNextPhotoSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the selectPrevious$ event is emitted', () => {
      beforeEach(async () => {
        testUtils.setSelectPreviousInput();
        testUtils.detectChanges();
      });

      it('should call the `gallery.selectPreviousPhoto()` method', async () => {
        const selectPreviousSpy = testUtils.getSelectPreviousSpy();
        selectPreviousSpy.calls.reset();

        testUtils.emitSelectPrevious();

        expect(selectPreviousSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when a slide from the swiper is clicked on', () => {
      let clickedSlideIndex: number;

      it('should select the corresponding photo', () => {
        const selectPhotoSpy = testUtils.getSelectPhotoSpy();
        selectPhotoSpy.calls.reset();

        clickedSlideIndex = 1;
        testUtils.clickOnSlide(clickedSlideIndex);

        const expectedSelectedPhoto = dumbPhotos[clickedSlideIndex];
        expect(selectPhotoSpy).toHaveBeenCalledOnceWith(
          expectedSelectedPhoto._id
        );
      });

      it('should swipe to the selected item', fakeAsync(() => {
        const swipeToItemSpy = testUtils.getSwipeToItemSpy();
        swipeToItemSpy.calls.reset();

        clickedSlideIndex = 0;
        testUtils.clickOnSlide(clickedSlideIndex);
        tick();

        expect(swipeToItemSpy).toHaveBeenCalledOnceWith(clickedSlideIndex);
      }));
    });

    describe('when there are more photos to load', () => {
      describe("when selecting a slide that is less than or equal to 2 slides away from the swiper's end", () => {
        const selectedPhotoIndex = 5;
        const selectedPhoto = dumbPhotos[selectedPhotoIndex];

        beforeEach(async () => {
          testUtils.getHasMorePhotosToLoadSpy().and.returnValue(true);
          testUtils.detectChanges();
        });

        it('should load more photos and add them to the swiper', fakeAsync(() => {
          const photosToLoad = [new Photo('dumb')];
          const loadPhotosSpy = testUtils.getLoadPhotosFromServerSpy();

          const searchResult$: Observable<ISearchResult<IPhoto>> = of({
            hits: photosToLoad,
            totalCount: photosToLoad.length,
          });
          loadPhotosSpy.and.returnValue(searchResult$);
          testUtils.detectChanges();

          loadPhotosSpy.calls.reset();
          testUtils.selectPhoto(selectedPhoto._id);
          tick();

          expect(loadPhotosSpy).toHaveBeenCalledTimes(1);
          testUtils.expectEmittedAddItemsToBe(photosToLoad);
        }));
      });
    });
  });
});
