import { PhotoApiService } from './photo-api.service';
import {
  ApiServiceTestUtils,
  IApiServiceTestUtils,
} from '../../../test-utils-context';
import { ENVIRONMENT_TOKEN } from '../../../environment-context';
import { IAddPhotoParams, IPhoto } from '../models';
import { TestBed } from '@angular/core/testing';

export class PhotoApiTestUtils
  extends ApiServiceTestUtils<PhotoApiService>
  implements IApiServiceTestUtils<PhotoApiService>
{
  private readonly providers = [
    {
      provide: ENVIRONMENT_TOKEN,
      useValue: { phogaApiUrl: this.apiBaseUrl },
    },
  ];
  private readonly consoleErrorSpy = spyOn(console, 'error');

  constructor() {
    const apiBaseUrl = 'http://api-domain.com';
    super(PhotoApiService, apiBaseUrl);
  }

  globalBeforeEach(): void {
    const providers = [...this.baseProviders, this.providers];
    TestBed.configureTestingModule({ providers });
    this.baseOnConfigureTestingModule();
  }

  globalAfterEach(): void {
    this.baseGlobalAfterEach();
  }

  expectEqualPhotos(photo1: IPhoto, photo2: IPhoto): void {
    expect(photo1).toEqual(photo2);
  }

  async fakeResponseErrorAndExpectErrorHandling(
    request$: Promise<unknown>
  ): Promise<void> {
    this.fakeResponseError();

    try {
      await request$;
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    } finally {
      this.expectConsoleErrorLog();
    }
  }

  private expectConsoleErrorLog(): void {
    expect(this.consoleErrorSpy).toHaveBeenCalledTimes(1);
  }

  getFormData(addPhotoParams: IAddPhotoParams): FormData {
    let formData = new FormData();
    if (addPhotoParams._id) {
      formData.append('_id', addPhotoParams._id);
    }
    if (addPhotoParams.metadata?.date) {
      formData.append('date', addPhotoParams.metadata.date.toISOString());
    }
    if (addPhotoParams.metadata?.description) {
      formData.append('description', addPhotoParams.metadata.description);
    }
    if (addPhotoParams.metadata?.location) {
      formData.append('location', addPhotoParams.metadata.location);
    }
    if (addPhotoParams.metadata?.titles) {
      formData.append('titles', addPhotoParams.metadata.titles.join(','));
    }
    if (addPhotoParams.imageBuffer) {
      formData.append(
        'image',
        new File([addPhotoParams.imageBuffer!.buffer], 'image')
      );
    }
    if (addPhotoParams.tagIds) {
      formData.append('tagIds', addPhotoParams.tagIds.join(','));
    }
    return formData;
  }
}
