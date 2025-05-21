import { ISearchPhotoFilter } from '../models';
import { GalleryService } from './gallery.service';
import { GalleryServiceTestUtils } from './gallery.service.test-utils';

describe('GalleryServiceService', () => {
  let testUtils: GalleryServiceTestUtils;
  let testedService: GalleryService;

  beforeEach(() => {
    testUtils = new GalleryServiceTestUtils();
    testUtils.globalBeforeEach();
    testedService = testUtils.getTestedService();
  });

  it('should be created', () => {
    expect(testedService).toBeTruthy();
  });

  describe('create', () => {
    it("should add a gallery to the services's galleries list", () => {
      const id = 'gallery-to-add';
      const filter: ISearchPhotoFilter = {};

      testedService.create(id, filter);

      testUtils.expectGalleryToBeCreated(id, filter);
    });
  });

  describe('get', () => {
    describe('when the gallery exists', () => {
      const galleryId = 'gallery-to-get';

      beforeEach(() => {
        testedService.create(galleryId);
      });

      it('should return the required gallery', () => {
        const result = testedService.get(galleryId);
        expect(result).toBeTruthy();
      });
    });

    describe('when the gallery does not exist', () => {
      it('should return `undefined`', () => {
        const result = testedService.get('inexistent-gallery-id');
        expect(result).toBeUndefined();
      });
    });
  });

  describe('getAll', () => {
    describe('when there is no gallery', () => {
      it('should return an empty array', () => {
        const result = testedService.getAll();
        expect(result).toEqual([]);
      });
    });

    describe('when there are galleries', () => {
      const galleryIds = ['gallery-1', 'gallery-2'];

      beforeEach(() => {
        galleryIds.forEach((id) => {
          testedService.create(id);
        });
      });

      it("should return the list of services's galleries", () => {
        testUtils.expectServiceGalleriesToBe(galleryIds);
      });
    });
  });

  describe('selectedGallery$', () => {
    it('should be `undefined` by default', async () => {
      const expectedGalleryId = undefined;

      testUtils.expectSelectedGalleryToBe(expectedGalleryId);
    });

    it('should change according to select/deselect actions', async () => {
      const galleryId = 'dumb-id';
      testedService.create(galleryId);

      testedService.select(galleryId);
      let expectedSelectedGalleryId: string | undefined = galleryId;
      await testUtils.expectSelectedGalleryToBe(expectedSelectedGalleryId);

      testedService.deselect();
      expectedSelectedGalleryId = undefined;
      await testUtils.expectSelectedGalleryToBe(undefined);
    });
  });

  describe('select', () => {
    const galleryId = 'dumb-id';

    beforeEach(() => {
      testedService.create(galleryId);
    });

    it('should select the required gallery', async () => {
      const expectedSelectedGalleryId = galleryId;

      testedService.select(galleryId);

      await testUtils.expectSelectedGalleryToBe(expectedSelectedGalleryId);
    });
  });

  describe('deselect', () => {
    const galleryId = 'dumb-id';

    beforeEach(() => {
      testedService.create(galleryId);
      testedService.select(galleryId);
    });

    it('should deselect the gallery', async () => {
      const expectedSelectedGalleryId = undefined;

      testedService.deselect();

      await testUtils.expectSelectedGalleryToBe(expectedSelectedGalleryId);
    });
  });
});
