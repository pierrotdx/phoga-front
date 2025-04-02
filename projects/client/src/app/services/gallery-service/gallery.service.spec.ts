import { Subscription } from 'rxjs';
import { IPhoto } from '@shared/photo-context';
import { GalleryServiceTestUtils } from './gallery.test-utils';
import { GalleryService } from './gallery.service';
import { IGalleryPhotos } from '../../models';

describe('GalleryService', () => {
  let testUtils: GalleryServiceTestUtils;
  let galleryService: GalleryService;

  beforeEach(() => {
    testUtils = new GalleryServiceTestUtils();
    testUtils.globalBeforeEach();
    galleryService = testUtils.getService();
  });

  it('should be created', () => {
    testUtils.expectServiceToBeCreated();
  });

  describe('photos', () => {
    it('should be initialized to an empty array', () => {
      const expectedPhotos: IGalleryPhotos = { all: [], lastBatch: [] };
      testUtils.expectServicePhotosToBe(expectedPhotos);
    });
  });

  describe('loadMore', () => {
    let stubLoadedPhotos: IPhoto[];
    let size: number;
    let defaultSize: number;

    beforeEach(() => {
      defaultSize = testUtils.getService()['defaultSize'];
      size = defaultSize;
      stubLoadedPhotos = testUtils.getLoadedPhotosBatch(0, size);
      testUtils.stubSearchPhotoResponse(stubLoadedPhotos);
    });

    it("should update the value of service's photos", async () => {
      const expectedPhotos: IGalleryPhotos = {
        all: [],
        lastBatch: [],
      };
      testUtils.expectServicePhotosToBe(expectedPhotos);
      testUtils.expectServicePhotosLengthToBe(0);

      const batchSize = defaultSize;
      for (let batchNb = 1; batchNb < 3; batchNb++) {
        const batchStart = (batchNb - 1) * batchSize;
        stubLoadedPhotos = testUtils.getLoadedPhotosBatch(
          batchStart,
          batchSize
        );
        testUtils.stubSearchPhotoResponse(stubLoadedPhotos);

        await galleryService.loadMore();

        expectedPhotos.all = expectedPhotos.all.concat(stubLoadedPhotos);
        expectedPhotos.lastBatch = stubLoadedPhotos;
        testUtils.expectServicePhotosToBe(expectedPhotos);
        // for simplicity we consider case where the returned batches are full (= batchSize)
        testUtils.expectServicePhotosLengthToBe(batchNb * batchSize);
      }
    });

    describe('request', () => {
      it('should request the next photo batch based on the previous one', async () => {
        testUtils.stubSearchPhotoResponse(stubLoadedPhotos);

        let expectedFrom = 0;
        await galleryService.loadMore();

        testUtils.expectPhotoRequestFromToBe(expectedFrom);

        const photos = galleryService.photos$.getValue();
        expectedFrom += photos.lastBatch.length + 1;
        await galleryService.loadMore();

        testUtils.expectPhotoRequestFromToBe(expectedFrom);
      });

      describe("response's size", () => {
        it(`should be of the service\'s default size`, async () => {
          const expectedSize = defaultSize;

          await galleryService.loadMore();

          testUtils.expectPhotoRequestSizeToBe(expectedSize);
        });

        it('should match the input size', async () => {
          const expectedSize = 4;

          await galleryService.loadMore(expectedSize);

          testUtils.expectPhotoRequestSizeToBe(expectedSize);
        });
      });

      it('should not send the request when there is no more photos to load', async () => {
        size = 3;
        // last batch because batch-size < size
        const lastPhotoBatch = stubLoadedPhotos.slice(0, size - 1);
        testUtils.stubSearchPhotoResponse(lastPhotoBatch);

        await galleryService.loadMore(size);

        const expectedPhotos: IGalleryPhotos = {
          all: lastPhotoBatch,
          lastBatch: lastPhotoBatch,
        };
        testUtils.expectServicePhotosToBe(expectedPhotos);
        await galleryService.loadMore(size);

        const requestSpy = testUtils.getSearchPhotoSpy();
        expect(requestSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('isLoading', () => {
      let isLoadingSub: Subscription;
      const isLoadingSuccessiveValues: boolean[] = [];
      const appendIsLoadingValue = (value: boolean) =>
        isLoadingSuccessiveValues.push(value);

      beforeEach(() => {
        const isLoading$ = testUtils.getService().isLoading$;
        isLoadingSub = isLoading$.subscribe(appendIsLoadingValue);
      });

      afterEach(() => {
        isLoadingSub.unsubscribe();
      });

      it('should be false by default', () => {
        expect(isLoadingSuccessiveValues[0]).toBeFalse();
      });

      it('should emit true when the loading is starting', async () => {
        await galleryService.loadMore();
        expect(isLoadingSuccessiveValues[0]).toBeFalse();
        expect(isLoadingSuccessiveValues[1]).toBeTrue();
      });

      it('should emit false when the loading returns photos', async () => {
        await galleryService.loadMore();
        expect(isLoadingSuccessiveValues[0]).toBeFalse();
        expect(isLoadingSuccessiveValues[1]).toBeTrue();
        expect(isLoadingSuccessiveValues[2]).toBeFalse();
      });

      it('should emit false in case of loading error', async () => {
        const stubError = new Error('stub error');
        testUtils.stubSearchPhotoResponse(stubError);
        try {
          await galleryService.loadMore();
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

  describe('selectPhoto', () => {
    beforeEach(() => {
      const stubPhotos: IGalleryPhotos = {
        all: testUtils.allStubPhotos,
        lastBatch: testUtils.allStubPhotos,
      };
      testUtils.stubServicePhotos(stubPhotos);
    });

    it('should select the input photo', () => {
      const expectedPhoto = testUtils.allStubPhotos[0];

      galleryService.selectPhoto(expectedPhoto._id);

      testUtils.expectSelectedPhotoToBe(expectedPhoto._id);
    });

    it("should leave the selection unchanged if the input photo is not part of the service's photos", () => {
      const selectedPhoto = testUtils.allStubPhotos[0];
      galleryService.selectPhoto(selectedPhoto._id);

      const inexistantPhotoId = 'some id';
      galleryService.selectPhoto(inexistantPhotoId);

      testUtils.expectSelectedPhotoToBe(selectedPhoto._id);
    });
  });

  describe('deselectPhoto', () => {
    let selectedPhoto: IPhoto | undefined;

    beforeEach(() => {
      const stubPhotos: IGalleryPhotos = {
        all: testUtils.allStubPhotos,
        lastBatch: testUtils.allStubPhotos,
      };
      testUtils.stubServicePhotos(stubPhotos);

      selectedPhoto = testUtils.allStubPhotos[0];
      galleryService.selectPhoto(selectedPhoto._id);
    });

    it('should deselect the selected photo', () => {
      expect(selectedPhoto?._id).toBeDefined();
      testUtils.expectSelectedPhotoToBe(selectedPhoto!._id);

      galleryService.deselectPhoto();

      testUtils.expectSelectedPhotoToBe(undefined);
    });
  });

  describe('selectedPhoto$', () => {
    beforeEach(() => {
      const stubPhotos: IGalleryPhotos = {
        all: testUtils.allStubPhotos,
        lastBatch: testUtils.allStubPhotos,
      };
      testUtils.stubServicePhotos(stubPhotos);
    });

    it('should be `undefined` by default', () => {
      const selectedPhoto = testUtils.getSelectedPhoto();
      expect(selectedPhoto).toBeUndefined();
    });

    it('should change according to (de)selection ', () => {
      let selectedPhoto = testUtils.getSelectedPhoto();

      expect(selectedPhoto).toBeUndefined();

      const expectedSelectedPhoto = testUtils.allStubPhotos[0];
      galleryService.selectPhoto(expectedSelectedPhoto._id);
      testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);

      galleryService.deselectPhoto();
      testUtils.expectSelectedPhotoToBe(undefined);
    });
  });
});
