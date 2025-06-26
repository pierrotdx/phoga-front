import { firstValueFrom, Subscription } from 'rxjs';
import { IGalleryPhotos, IPhoto, ISelectedPhoto, Photo } from '../models';
import { Gallery } from './gallery';
import { GalleryTestUtils } from './gallery.test-utils';
import { ISearchResult } from '@shared/models';
import { splitEvery } from 'ramda';

describe('Gallery', () => {
  let testUtils: GalleryTestUtils;
  let testedClass: Gallery;

  const dumbPhotos: IPhoto[] = [
    new Photo('dumb photo 1'),
    new Photo('dumb photo 2'),
    new Photo('dumb photo 3'),
    new Photo('dumb photo 4'),
    new Photo('dumb photo 5'),
  ];

  beforeEach(() => {
    testUtils = new GalleryTestUtils();
    testedClass = testUtils.getTestedClass();
  });

  it('should have an id', () => {
    expect(testedClass._id).toBeDefined();
  });

  describe('photos', async () => {
    it('should be initialized to an empty array', async () => {
      const expectedPhotos: IGalleryPhotos = { all: [], lastBatch: [] };
      await testUtils.expectGalleryPhotosToBe(expectedPhotos);
    });
  });

  describe('loadMore', () => {
    let size: number;

    beforeEach(() => {
      size = 2;
    });

    it("should add more photos to the gallery's photos", async () => {
      const expectedGalleryPhotos: IGalleryPhotos = {
        all: [],
        lastBatch: [],
      };
      await testUtils.expectGalleryPhotosToBe(expectedGalleryPhotos);

      const batches = splitEvery(size, dumbPhotos);
      for (const batch of batches) {
        const searchResult: ISearchResult<IPhoto> = {
          hits: batch,
          totalCount: dumbPhotos.length,
        };
        expectedGalleryPhotos.lastBatch = searchResult.hits;
        expectedGalleryPhotos.all = expectedGalleryPhotos.all.concat(
          searchResult.hits
        );

        testUtils.simulateNextServerResponse(searchResult);
        await testedClass.loadMore(batch.length);

        await testUtils.expectGalleryPhotosToBe(expectedGalleryPhotos);
      }
    });

    describe('when there is no more photos to load', () => {
      it('should not send the request when there is no more photos to load', async () => {
        const searchResult: ISearchResult<IPhoto> = {
          hits: dumbPhotos,
          totalCount: dumbPhotos.length,
        };

        testUtils.simulateNextServerResponse(searchResult);

        size = dumbPhotos.length;
        await testedClass.loadMore(size);

        const expectedPhotos: IGalleryPhotos = {
          all: dumbPhotos,
          lastBatch: dumbPhotos,
        };
        await testUtils.expectGalleryPhotosToBe(expectedPhotos);
        await testedClass.loadMore(size);

        const requestSpy = testUtils.getServerRequestSpy();
        expect(requestSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('the `from` request parameter', () => {
      it('should be updated based on the previous request', async () => {
        let expectedFromInRequest = 0;

        const batches = splitEvery(size, dumbPhotos);
        for (const batch of batches) {
          const searchResult: ISearchResult<IPhoto> = {
            hits: batch,
            totalCount: dumbPhotos.length,
          };
          testUtils.simulateNextServerResponse(searchResult);
          await testedClass.loadMore(size);

          testUtils.expectFromRequestParamToBe(expectedFromInRequest);

          expectedFromInRequest += batch.length + 1;
        }
      });
    });

    describe('the `size` request parameter', () => {
      beforeEach(() => {
        const searchResult: ISearchResult<IPhoto> = {
          hits: [],
          totalCount: 0,
        };
        testUtils.simulateNextServerResponse(searchResult);
      });

      it(`should have a default value`, async () => {
        const expectedSize = testUtils.getDefaultSize();

        await testedClass.loadMore();

        testUtils.expectSizeRequestParamToBe(expectedSize);
      });

      it('should match the required size', async () => {
        const expectedSize = 4;

        await testedClass.loadMore(expectedSize);

        testUtils.expectSizeRequestParamToBe(expectedSize);
      });
    });
  });

  describe('isLoading$', () => {
    let isLoadingSub: Subscription;
    let isLoadingSuccessiveValues: boolean[] = [];
    const appendIsLoadingValue = (value: boolean) =>
      isLoadingSuccessiveValues.push(value);

    beforeEach(() => {
      isLoadingSuccessiveValues = [];
      isLoadingSub = testedClass.isLoading$.subscribe(appendIsLoadingValue);
      testUtils.simulateNextServerResponse({ hits: [], totalCount: 0 });
    });

    afterEach(() => {
      isLoadingSub.unsubscribe();
    });

    it('should be `false` by default', () => {
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
    });

    it('should emit `true` when the loading is starting', async () => {
      await testedClass.loadMore();
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
      expect(isLoadingSuccessiveValues[1]).toBeTrue();
    });

    it('should emit `false` when the loading has finished', async () => {
      await testedClass.loadMore();
      expect(isLoadingSuccessiveValues[0]).toBeFalse();
      expect(isLoadingSuccessiveValues[1]).toBeTrue();
      expect(isLoadingSuccessiveValues[2]).toBeFalse();
    });

    describe('when the server responds with an error', () => {
      const stubError = new Error('stub error');

      beforeEach(() => {
        testUtils.simulateNextServerResponse(stubError);
      });

      it('should emit `false`', async () => {
        try {
          await testedClass.loadMore();
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
      const size = 2;
      const galleryPhotos: IGalleryPhotos = {
        all: dumbPhotos,
        lastBatch: dumbPhotos.slice(-1 * size, -1),
      };
      testUtils.simulateGalleryPhotos(galleryPhotos);
    });

    it('should select the required photo', async () => {
      const expectedPhoto = dumbPhotos[0];

      testedClass.selectPhoto(expectedPhoto._id);

      await testUtils.expectSelectedPhotoToBe(expectedPhoto._id);
    });

    describe("when the required photo is not part of the gallery's photos", () => {
      let selectedPhoto: IPhoto;

      beforeEach(() => {
        selectedPhoto = dumbPhotos[0];
        testedClass.selectPhoto(selectedPhoto._id);
      });

      it('should leave the selection unchanged', async () => {
        const inexistantPhotoId = 'some id';
        const expectedPhoto = selectedPhoto;

        testedClass.selectPhoto(inexistantPhotoId);

        await testUtils.expectSelectedPhotoToBe(expectedPhoto._id);
      });
    });
  });

  describe('deselectPhoto', () => {
    let selectedPhoto: IPhoto | undefined;

    beforeEach(() => {
      const size = 2;
      const galleryPhotos: IGalleryPhotos = {
        all: dumbPhotos,
        lastBatch: dumbPhotos.slice(-1 * size, -1),
      };
      testUtils.simulateGalleryPhotos(galleryPhotos);

      selectedPhoto = dumbPhotos[0];
      testedClass.selectPhoto(selectedPhoto._id);
    });

    it('should deselect the selected photo', async () => {
      expect(selectedPhoto?._id).toBeDefined();
      await testUtils.expectSelectedPhotoToBe(selectedPhoto!._id);

      testedClass.deselectPhoto();

      await testUtils.expectSelectedPhotoToBe(undefined);
    });
  });

  describe('selectedPhoto$', () => {
    beforeEach(() => {
      const size = 2;
      const galleryPhotos: IGalleryPhotos = {
        all: dumbPhotos,
        lastBatch: dumbPhotos.slice(-1 * size, -1),
      };
      testUtils.simulateGalleryPhotos(galleryPhotos);
    });

    it('should be `undefined` by default', async () => {
      const selectedPhoto = await testUtils.getSelectedPhoto();
      expect(selectedPhoto).toBeUndefined();
    });

    it('should change according to select/deselect actions', async () => {
      let selectedPhoto = await testUtils.getSelectedPhoto();

      expect(selectedPhoto).toBeUndefined();

      const expectedSelectedPhoto = dumbPhotos[0];
      testedClass.selectPhoto(expectedSelectedPhoto._id);
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);

      testedClass.deselectPhoto();
      await testUtils.expectSelectedPhotoToBe(undefined);
    });
  });

  describe('hasMorePhotosToLoad', () => {
    describe('when all photos have been loaded', () => {
      beforeEach(async () => {
        testUtils.simulateNextServerResponse({
          hits: dumbPhotos,
          totalCount: dumbPhotos.length,
        });
        const size = dumbPhotos.length;
        await testedClass.loadMore(size);
      });

      it('should return `false`', () => {
        const hasMoreToLoad = testedClass.hasMorePhotosToLoad();
        expect(hasMoreToLoad).toBeFalse();
      });
    });

    describe('when there are still more photos to load', () => {
      beforeEach(async () => {
        testUtils.simulateNextServerResponse({
          hits: dumbPhotos.slice(0, 1),
          totalCount: dumbPhotos.length,
        });
        await testedClass.loadMore();
      });

      it('should return `true`', () => {
        const hasMoreToLoad = testedClass.hasMorePhotosToLoad();
        expect(hasMoreToLoad).toBeTrue();
      });
    });
  });

  describe('totalCount$', () => {
    describe('when the gallery has not loaded any photo yet', () => {
      it('should return `undefined`', async () => {
        const expectedResult = undefined;
        const totalCount = await firstValueFrom(testedClass.totalCount$);
        expect(totalCount).toBe(expectedResult);
      });
    });

    describe('when the gallery has loaded photos', () => {
      const size = 2;
      const searchResult: ISearchResult<IPhoto> = {
        hits: dumbPhotos.slice(0, size),
        totalCount: dumbPhotos.length,
      };

      beforeEach(async () => {
        testUtils.simulateNextServerResponse(searchResult);
        await testedClass.loadMore(size);
      });

      it('should have a value equal to the total number of results', async () => {
        const expectedResult = searchResult.totalCount;
        const totalCount = await firstValueFrom(testedClass.totalCount$);
        expect(totalCount).toBe(expectedResult);
      });
    });
  });

  describe('selectNextPhoto', () => {
    const galleryPhotos: IGalleryPhotos = {
      all: dumbPhotos,
      lastBatch: [],
    };

    beforeEach(() => {
      testUtils.simulateGalleryPhotos(galleryPhotos);
    });

    describe('when no photo is selected', () => {
      it('should select the first photo', async () => {
        const expectedSelectedPhoto = dumbPhotos[0];

        await testedClass.selectNextPhoto();

        await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
      });
    });

    describe('when the last photo is selected', () => {
      const initSelectedPhoto = galleryPhotos.all[galleryPhotos.all.length - 1];

      beforeEach(() => {
        testedClass.selectPhoto(initSelectedPhoto._id);
      });

      describe('when there are no more photos to load', () => {
        beforeEach(() => {
          testUtils.simulateHasMorePhotos(false);
        });

        it('should not change the selected photo', async () => {
          const expectedSelectedPhoto = initSelectedPhoto;

          await testedClass.selectNextPhoto();

          await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
        });
      });

      describe('when there are more photos to load', () => {
        let additionalPhotosToLoad: IPhoto[];

        it('should try to load more photos', async () => {
          const loadMoreSpy = testUtils.getServerRequestSpy();
          loadMoreSpy.calls.reset();
          testUtils.simulateNextServerResponse({
            hits: [],
            totalCount: dumbPhotos.length,
          });

          await testedClass.selectNextPhoto();

          expect(loadMoreSpy).toHaveBeenCalledTimes(1);
        });

        describe('when the loaded-photos batch is not empty', () => {
          beforeEach(() => {
            additionalPhotosToLoad = [
              new Photo('additional-1'),
              new Photo('additional-2'),
            ];
            testUtils.simulateNextServerResponse({
              hits: additionalPhotosToLoad,
              totalCount: dumbPhotos.length + additionalPhotosToLoad.length,
            });
          });

          it('should select the first photo of the freshly loaded batch', async () => {
            const expectedSelectedPhoto = additionalPhotosToLoad[0];

            await testedClass.selectNextPhoto();

            await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
          });
        });

        describe('when the loaded-photos batch is empty', () => {
          beforeEach(() => {
            additionalPhotosToLoad = [];
            testUtils.simulateNextServerResponse({
              hits: additionalPhotosToLoad,
              totalCount: dumbPhotos.length + additionalPhotosToLoad.length,
            });
          });

          it('should not change the current selected photo', async () => {
            const expectedSelectedPhoto = initSelectedPhoto;

            await testedClass.selectNextPhoto();

            await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
          });
        });
      });
    });

    it('should select the next photo', async () => {
      const initSelectedPhoto = galleryPhotos.all[0];
      testedClass.selectPhoto(initSelectedPhoto._id);

      await testedClass.selectNextPhoto();

      const expectedSelectedPhoto = galleryPhotos.all[1];
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
    });
  });

  describe('selectPreviousPhoto', () => {
    const galleryPhotos: IGalleryPhotos = {
      all: dumbPhotos,
      lastBatch: [],
    };

    beforeEach(() => {
      testUtils.simulateGalleryPhotos(galleryPhotos);
    });

    describe('when no photo was selected', () => {
      it('should leave the selection empty', async () => {
        const expectedSelectedPhoto: ISelectedPhoto = undefined;

        testedClass.selectPreviousPhoto();

        await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto);
      });
    });

    describe('when the selected photo was the first one', () => {
      const initSelectedPhoto = galleryPhotos.all[0];

      beforeEach(() => {
        testedClass.selectPhoto(initSelectedPhoto._id);
      });

      it('should not change the selected photo', async () => {
        const expectedSelectedPhoto: ISelectedPhoto = initSelectedPhoto;

        testedClass.selectPreviousPhoto();

        await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
      });
    });

    it('should select the previous photo', async () => {
      const initSelectedPhoto = galleryPhotos.all[1];
      testedClass.selectPhoto(initSelectedPhoto._id);

      testedClass.selectPreviousPhoto();

      const expectedSelectedPhoto: ISelectedPhoto = galleryPhotos.all[0];
      await testUtils.expectSelectedPhotoToBe(expectedSelectedPhoto._id);
    });
  });
});
