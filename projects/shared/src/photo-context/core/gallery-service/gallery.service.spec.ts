import exp from 'constants';
import { IGalleryPhotos, IPhoto, ISelectedPhoto, Photo } from '../../';
import { GalleryService } from './gallery.service';
import { GalleryServiceTestUtils } from './gallery.service.test-utils';
import { Subscription } from 'rxjs';

describe('GalleryServiceService', () => {
  let testUtils: GalleryServiceTestUtils;
  let testedService: GalleryService;

  const dumbPhotos: IPhoto[] = [
    new Photo('dumb photo 1'),
    new Photo('dumb photo 2'),
    new Photo('dumb photo 3'),
    new Photo('dumb photo 4'),
    new Photo('dumb photo 5'),
  ];

  beforeEach(() => {
    testUtils = new GalleryServiceTestUtils();
    testUtils.globalBeforeEach();
    testedService = testUtils.getTestedService();
  });

  it('should be created', () => {
    expect(testedService).toBeTruthy();
  });

  describe('loadMore', () => {
    let loadPhotosSpy: jasmine.Spy;

    beforeEach(() => {
      loadPhotosSpy = testUtils.getLoadPhotosSpy();
      loadPhotosSpy.calls.reset();

      const photosToLoad = dumbPhotos.slice(0, 2);
      testUtils.simulateNextPhotoBatchLoading(photosToLoad);
    });

    it('should load more photos', async () => {
      await testedService.loadMore();

      expect(loadPhotosSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('galleryPhotos$', () => {
    it('should have a default value', async () => {
      const expectedGalleryPhotos: IGalleryPhotos = { all: [], lastBatch: [] };
      await testUtils.expectGalleryPhotosToBe(expectedGalleryPhotos);
    });
  });

  describe('selectPhoto', () => {
    beforeEach(async () => {
      testUtils.simulateNextPhotoBatchLoading(dumbPhotos);
      await testedService.loadMore();
    });

    it('should select the required photo', async () => {
      const photoToSelect = dumbPhotos[1];

      testedService.selectPhoto(photoToSelect._id);

      const expectedSelectedPhoto = photoToSelect;
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);
    });
  });

  describe('deselectPhoto', () => {
    const selectedPhoto = dumbPhotos[2];

    beforeEach(async () => {
      testUtils.simulateNextPhotoBatchLoading(dumbPhotos);
      await testedService.loadMore();

      testedService.selectPhoto(selectedPhoto._id);
    });

    it('should reset the selected photo', async () => {
      testedService.deselectPhoto();

      const expectedSelectedPhoto = undefined;
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);
    });
  });

  describe('selectedPhoto$', () => {
    it('should be `undefined` by default', async () => {
      const expectedSelectedPhoto = undefined;
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);
    });

    it('should change according to select/deselect actions', async () => {
      testUtils.simulateNextPhotoBatchLoading(dumbPhotos);
      await testedService.loadMore();

      let expectedSelectedPhoto: ISelectedPhoto = dumbPhotos[0];
      testedService.selectPhoto(expectedSelectedPhoto._id);
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);

      testedService.deselectPhoto();
      expectedSelectedPhoto = undefined;
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);
    });
  });

  describe('isLoading$', () => {
    let isLoadingSub: Subscription;
    let isLoadingSuccessiveValues: boolean[] = [];
    const appendIsLoadingValue = (value: boolean) =>
      isLoadingSuccessiveValues.push(value);

    beforeEach(() => {
      isLoadingSuccessiveValues = [];
      const isLoading$ = testedService.isLoading$;
      isLoadingSub = isLoading$.subscribe(appendIsLoadingValue);
      testUtils.simulateNextPhotoBatchLoading([]);
    });

    afterEach(() => {
      isLoadingSub.unsubscribe();
    });

    it('should be `false` by default', () => {
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
    });

    it('should emit `true` when the loading is starting', async () => {
      await testedService.loadMore();
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
      expect(isLoadingSuccessiveValues[1]).toBeTrue();
    });

    it('should emit `false` when the loading has finished', async () => {
      await testedService.loadMore();
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
      expect(isLoadingSuccessiveValues[1]).toBeTrue();
      expect(isLoadingSuccessiveValues[2]).toBeFalse();
    });

    describe('when the server responds with an error', () => {
      const stubError = new Error('stub error');

      beforeEach(() => {
        testUtils.simulateNextPhotoBatchLoading(stubError);
      });

      it('should emit `false`', async () => {
        try {
          await testedService.loadMore();
        } catch (err) {
          expect(err).toEqual(stubError);
        } finally {
          expect(isLoadingSuccessiveValues[0]).toBeFalse();
          expect(isLoadingSuccessiveValues[1]).toBeTrue();
          expect(isLoadingSuccessiveValues[2]).toBeFalse();
        }
      });
    });
  });

  describe('hasMorePhotosToLoad', () => {
    describe('when the server responds with full batches', () => {
      beforeEach(async () => {
        const size = 3;
        const fullBatch = dumbPhotos.slice(0, size);
        testUtils.simulateNextPhotoBatchLoading(fullBatch);
        await testedService.loadMore(size);
      });

      it('should return `true`', () => {
        const hasMoreToLoad = testedService.hasMorePhotosToLoad();
        expect(hasMoreToLoad).toBeTrue();
      });
    });

      describe('when the server responds with non-full batches', () => {
        beforeEach(async () => {
        const size = 3;
        const nonFullBatch = dumbPhotos.slice(0, size - 1);
        testUtils.simulateNextPhotoBatchLoading(nonFullBatch);
        await testedService.loadMore(size);
      });

      it('should return `false`', () => {
        const hasMoreToLoad = testedService.hasMorePhotosToLoad();
        expect(hasMoreToLoad).toBeFalse();
      });
    });
  });
});
