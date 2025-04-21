import { TagApiService } from './tag-api.service';
import {
  ApiServiceTestUtils,
  IApiServiceTestUtils,
} from '@shared/test-utils-context';
import { ENVIRONMENT_TOKEN } from '@shared/environment-context';
import { TestBed } from '@angular/core/testing';

export class TagApiServiceTestUtils
  extends ApiServiceTestUtils<TagApiService>
  implements IApiServiceTestUtils<TagApiService>
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
    super(TagApiService, apiBaseUrl);
  }

  globalBeforeEach(): void {
    const providers = [...this.baseProviders, this.providers];
    TestBed.configureTestingModule({ providers });
    this.baseOnConfigureTestingModule();
  }

  globalAfterEach(): void {
    this.baseGlobalAfterEach();
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
