import { PhotoApiService } from './photo-api.service';
import {
  ApiServiceTestUtils,
  IApiServiceTestUtils,
} from '../../../test-utils-context';
import { ENVIRONMENT_TOKEN } from '../../../environment-context';
import { IPhoto } from '../models';
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
}
