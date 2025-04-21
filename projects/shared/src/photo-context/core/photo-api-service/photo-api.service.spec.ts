import { PhotoApiService } from './photo-api.service';
import { PhotoApiTestUtils } from './photo-api.test-utils';
import { IPhoto, ISearchPhotoOptions, Photo, SortDirection } from '../models';
import { Buffer } from 'buffer';
import { firstValueFrom } from 'rxjs';

describe('PhotoApiService', () => {
  let testUtils: PhotoApiTestUtils;
  let testedService: PhotoApiService;

  const photo = new Photo('c46c9afa-ff43-427e-bec2-4f07d77d99d1', {
    imageBuffer: Buffer.from('fake buffer'),
    photoData: {
      metadata: {
        date: new Date(),
        description: 'fake description',
        titles: ['title 1', 'title 2'],
        location: 'New Zealand',
      },
    },
  });

  beforeEach(() => {
    testUtils = new PhotoApiTestUtils();
    testUtils.globalBeforeEach();
    testedService = testUtils.getTestedService();
  });

  afterEach(() => {
    testUtils.globalAfterEach();
  });

  it('should be created', () => {
    expect(testedService).toBeTruthy();
  });

  describe(`getPhotoBase`, () => {
    const getPhotoRelativeUrl = `photo/${photo._id}/base`;

    it('should send a GET request to the api', () => {
      firstValueFrom(testedService.getPhotoBase(photo._id));

      testUtils.setupRequestMock(getPhotoRelativeUrl);

      testUtils.expectRequestMethodToBe('GET');
    });

    describe('when the API responds with a 200', () => {
      it('should return a photo base data', async () => {
        const request$ = firstValueFrom(testedService.getPhotoBase(photo._id));

        testUtils.setupRequestMock(getPhotoRelativeUrl);
        testUtils.fakeResponseBody(photo);

        const result = await request$;

        testUtils.expectEqualPhotos(photo, result as IPhoto);
      });
    });

    describe('when the API responds with an error', () => {
      it('should log the error in the console and return a more user friendly error', () => {
        const request$ = firstValueFrom(testedService.getPhotoBase(photo._id));

        testUtils.setupRequestMock(getPhotoRelativeUrl);
        testUtils.fakeResponseError();

        testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe(`getPhotoImage`, () => {
    const getPhotoImageRelativeUrl = `photo/${photo._id}/image`;

    it('should send a GET request to the api with the input options', () => {
      const options = {
        imageSize: { height: 812, width: 4684 },
      };
      const expectedQueryParams = { height: '812', width: '4684' };

      firstValueFrom(testedService.getPhotoImage(photo._id, options));

      testUtils.setupRequestMock(getPhotoImageRelativeUrl, options.imageSize);

      testUtils.expectQueryParamsToBe(expectedQueryParams);
      testUtils.expectRequestMethodToBe('GET');
    });

    describe('when the API responds with a 200', () => {
      it('should return a photo image buffer', async () => {
        const request$ = firstValueFrom(testedService.getPhotoImage(photo._id));

        testUtils.setupRequestMock(getPhotoImageRelativeUrl);
        testUtils.fakeResponseBody(photo.imageBuffer!.buffer);

        const result = await request$;
        expect(result).toEqual(photo.imageBuffer!);
      });
    });

    describe('when the API responds with an error', () => {
      it('should log the error in the console and return a more user friendly error', () => {
        const request$ = firstValueFrom(testedService.getPhotoImage(photo._id));

        testUtils.setupRequestMock(getPhotoImageRelativeUrl);
        testUtils.fakeResponseError();

        testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe(`searchPhoto`, () => {
    const searchPhotoRelativeUrl = `photo`;
    const photo2 = new Photo('e703ac39-5f29-46b6-8fa7-b65f40ae58b4', {
      imageBuffer: Buffer.from('fake buffer 2'),
      photoData: {
        metadata: {
          date: new Date('2041-05-12'),
          description: 'fake description 2',
          titles: ['title 3', 'title 4'],
          location: 'Japan',
        },
      },
    });
    const photos = [photo, photo2];

    it('should send a GET request to the api with the input options', () => {
      const filter: ISearchPhotoOptions = {
        excludeImages: true,
        rendering: {
          height: 812,
          width: 4684,
          size: 78,
          from: 4,
          dateOrder: SortDirection.Ascending,
        },
      };
      const expectedQueryParams = {
        height: '812',
        width: '4684',
        size: '78',
        from: '4',
        dateOrder: SortDirection.Ascending,
        excludeImages: 'true',
      };

      firstValueFrom(testedService.searchPhoto(filter));

      testUtils.setupRequestMock(searchPhotoRelativeUrl, expectedQueryParams);

      testUtils.expectRequestMethodToBe('GET');
      testUtils.expectQueryParamsToBe(expectedQueryParams);
    });

    describe('when the API responds with a 200', () => {
      it('should return an array of photos', async () => {
        const request$ = firstValueFrom(testedService.searchPhoto());

        testUtils.setupRequestMock(searchPhotoRelativeUrl);
        testUtils.fakeResponseBody(photos);
        const result = await request$;

        expect(result).toEqual(photos);
      });
    });

    describe('when the API responds with an error', () => {
      it('should log the error in the console and return a more user friendly error', async () => {
        const request$ = firstValueFrom(testedService.searchPhoto());

        testUtils.setupRequestMock(searchPhotoRelativeUrl);
        testUtils.fakeResponseError();

        testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });
});
