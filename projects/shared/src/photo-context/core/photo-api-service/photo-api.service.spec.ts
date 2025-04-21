import { EnvironmentProviders, Provider } from '@angular/core';
import { PhotoApiService } from './photo-api.service';
import { PhotoApiTestUtils } from './photo-api.test-utils';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT_TOKEN } from '@shared/environment-context';
import { IPhoto, IPhotoData, Photo, SortDirection } from '../models';
import { Buffer } from 'buffer';

describe('PhotoApiService', () => {
  const apiBaseUrl = 'http://apiDomain.com';
  let testUtils: PhotoApiTestUtils;
  let service: PhotoApiService;
  let httpTestingController: HttpTestingController;

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
  let expectedUrl: URL;

  beforeEach(() => {
    const imports: (Provider | EnvironmentProviders)[] = [
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ENVIRONMENT_TOKEN,
        useValue: { phogaApiUrl: apiBaseUrl },
      },
    ];
    const providers: (Provider | EnvironmentProviders)[] = [];
    testUtils = new PhotoApiTestUtils(imports, providers);
    service = testUtils.photoApiService;
    httpTestingController = testUtils.httpTestingController;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`getPhotoBase`, () => {
    const getPhotoBaseUrl = `${apiBaseUrl}/photo/${photo._id}/base`;

    beforeEach(() => {
      expectedUrl = new URL(getPhotoBaseUrl);
    });

    it('should send a GET request to the api', () => {
      const expectCallback = (result: IPhotoData | undefined | Error) => {
        expect(req.request.method).toEqual('GET');
      };
      service.getPhotoBase(photo._id).subscribe(expectCallback);
      const req = httpTestingController.expectOne(
        expectedUrl.toString(),
        'get-photo fake request'
      );
      const apiResponse: Pick<IPhoto, '_id' | 'metadata'> = photo;
      req.flush(apiResponse);
    });

    describe('in case of successful request', () => {
      it('should return a photo base data', () => {
        const expectCallback = (result: IPhotoData | undefined | Error) => {
          expect(result).toBeDefined();
          expect(result).toEqual(photo);
        };
        service.getPhotoBase(photo._id).subscribe(expectCallback);
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'get-photo fake request'
        );
        // the api sends an instance of photo with only metadata
        const apiResponse: Pick<IPhoto, '_id' | 'metadata'> = photo;
        req.flush(apiResponse);
      });
    });

    describe('in case of failed request', () => {
      it('should log the error in the console and return a more user friendly error', () => {
        const consoleSpy = spyOn(console, 'error');
        service.getPhotoBase(photo._id).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(Error);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
          },
        });
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'get-photo fake request'
        );
        const fakeError = new ProgressEvent('fake error');
        req.error(fakeError);
      });
    });
  });

  describe(`getPhotoImage`, () => {
    const getPhotoImageUrl = `${apiBaseUrl}/photo/${photo._id}/image`;

    beforeEach(() => {
      expectedUrl = new URL(getPhotoImageUrl);
    });

    it('should send a GET request to the api with the input options', () => {
      const height = 812;
      const width = 4684;
      expectedUrl.searchParams.append('height', height.toString());
      expectedUrl.searchParams.append('width', width.toString());
      const expectCallback = (result: IPhoto['imageBuffer'] | Error) => {
        expect(req.request.method).toEqual('GET');
      };
      service
        .getPhotoImage(photo._id, { imageSize: { height, width } })
        .subscribe(expectCallback);
      const req = httpTestingController.expectOne(
        expectedUrl.toString(),
        'get-photo fake request'
      );
      const apiResponse: ArrayBuffer = photo.imageBuffer?.buffer!;
      req.flush(apiResponse);
    });

    describe('in case of successful request', () => {
      it('should return a photo image buffer', () => {
        const expectCallback = (result: IPhoto['imageBuffer'] | Error) => {
          expect(result).toEqual(photo.imageBuffer!);
        };
        service.getPhotoImage(photo._id).subscribe(expectCallback);
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'get-photo fake request'
        );
        const apiResponse: ArrayBuffer = photo.imageBuffer?.buffer!;
        req.flush(apiResponse);
      });
    });

    describe('in case of failed request', () => {
      it('should log the error in the console and return a more user friendly error', () => {
        const consoleSpy = spyOn(console, 'error');
        service.getPhotoImage(photo._id).subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(Error);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
          },
        });
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'get-photo fake request'
        );
        const fakeError = new ProgressEvent('fake error');
        req.error(fakeError);
      });
    });
  });

  describe(`searchPhoto`, () => {
    const getPhotoImageUrl = `${apiBaseUrl}/photo`;
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

    beforeEach(() => {
      expectedUrl = new URL(getPhotoImageUrl);
    });

    it('should send a GET request to the api with the input options', () => {
      const height = 812;
      const width = 4684;
      const size = 78;
      const from = 4;
      const dateOrder = SortDirection.Ascending;
      const excludeImages = true;
      expectedUrl.searchParams.append('excludeImages', String(excludeImages));
      expectedUrl.searchParams.append('height', height.toString());
      expectedUrl.searchParams.append('width', width.toString());
      expectedUrl.searchParams.append('from', from.toString());
      expectedUrl.searchParams.append('size', size.toString());
      expectedUrl.searchParams.append('dateOrder', dateOrder);

      const expectCallback = (result: IPhoto[] | Error) => {
        expect(req.request.method).toEqual('GET');
      };
      service
        .searchPhoto({
          excludeImages,
          rendering: { height, width, from, size, dateOrder },
        })
        .subscribe(expectCallback);
      const req = httpTestingController.expectOne(
        expectedUrl.toString(),
        'search-photo fake request'
      );
      const apiResponse: IPhoto[] = photos;
      req.flush(apiResponse);
    });

    describe('in case of successful request', () => {
      it('should return an array of photos', () => {
        const expectCallback = (result: IPhoto[] | Error) => {
          expect(result).toEqual(photos);
        };
        service.searchPhoto().subscribe(expectCallback);
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'search-photo fake request'
        );
        const apiResponse: IPhoto[] = photos;
        req.flush(apiResponse);
      });
    });

    describe('in case of failed request', () => {
      it('should log the error in the console and return a more user friendly error', () => {
        const consoleSpy = spyOn(console, 'error');
        service.searchPhoto().subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(Error);
            expect(consoleSpy).toHaveBeenCalledTimes(1);
          },
        });
        const req = httpTestingController.expectOne(
          expectedUrl.toString(),
          'search-photo fake request'
        );
        const fakeError = new ProgressEvent('fake error');
        req.error(fakeError);
      });
    });
  });
});
