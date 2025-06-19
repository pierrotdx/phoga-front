import { DefaultGalleryId, IGallery, ISearchPhotoFilter } from '../models';
import { GalleryService } from './gallery.service';
import { GalleryServiceTestUtils } from './gallery.service.test-utils';
import { ITag } from '@shared/tag-context';

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

  describe('defaultGalleryId', () => {
    it(`should be "${DefaultGalleryId}"`, () => {
      expect(testedService.defaultGalleryId).toBe(DefaultGalleryId);
    });
  });

  describe('initGalleries', () => {
    const tags: ITag[] = [{ _id: 'tag-id-1' }, { _id: 'tag-id-2' }];

    beforeEach(() => {
      testUtils.fakeTagSearch(tags);
    });

    it('should create the default gallery', async () => {
      const defaultGalleryBefore = testedService.get(DefaultGalleryId);
      expect(defaultGalleryBefore).toBeUndefined();

      await testedService.initGalleries();

      testUtils.expectGalleryToBeCreated(DefaultGalleryId);
    });

    it('should create a gallery for each tags', async () => {
      await testedService.initGalleries();

      tags.forEach((tag) => {
        const expectedId = tag._id;
        const expectedFilter: ISearchPhotoFilter = { tagId: tag._id };
        testUtils.expectGalleryToBeCreated(expectedId, expectedFilter);
      });
    });

    it('should preload photos for each gallery', async () => {
      const preloadSpies: jasmine.Spy[] = testUtils.getSpiesOfPhotosPreload();

      await testedService.initGalleries();

      preloadSpies.forEach((spy) => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it('should select the default gallery', async () => {
      await testedService.initGalleries();

      const expectedSelectedGalleryId = DefaultGalleryId;
      await testUtils.expectSelectedGalleryToBe(expectedSelectedGalleryId);
    });
  });

  describe('create', () => {
    describe('when the gallery id is available', () => {
      const id = 'gallery-to-add';

      it("should add a gallery to the services's galleries list and return the created gallery", () => {
        const createdGallery = testedService.create(id);

        testUtils.expectGalleryToBeCreated(id);
        expect(createdGallery).toBeDefined();
      });
    });

    describe('when the gallery id is already taken', () => {
      const id = 'already-existing-gallery-id';
      let alreadyExistingGallery: IGallery;

      beforeEach(() => {
        alreadyExistingGallery = testedService.create(id);
      });

      it('should not create a new gallery and return the one with the required id', () => {
        const expectedNbGalleries = testedService.getAll().length;

        const result = testedService.create(id);

        expect(result).toEqual(alreadyExistingGallery);
        testUtils.expectNbOfGalleriesToBe(expectedNbGalleries);
      });
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
