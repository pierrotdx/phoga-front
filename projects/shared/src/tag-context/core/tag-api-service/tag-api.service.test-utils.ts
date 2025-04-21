import { HttpRequest } from '@angular/common/http';
import { TagApiService } from './tag-api.service';
import { ISearchTagFilter } from '../models';
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

  constructor() {
    const apiBaseUrl = 'http://apiDomain.com';
    super(TagApiService, apiBaseUrl);
  }

  private readonly consoleErrorSpy = spyOn(console, 'error');

  globalBeforeEach(): void {
    const providers = [...this.baseProviders, this.providers];
    TestBed.configureTestingModule({ providers });
    this.baseOnConfigureTestingModule();
  }

  globalAfterEach(): void {
    this.baseGlobalAfterEach();
  }

  expectRequestMethodToBe(
    expectedRequestMethod: HttpRequest<any>['method']
  ): void {
    expect(this.requestMock.request.method).toBe(expectedRequestMethod);
  }

  expectRequestBodyToEqual(expectedBody: unknown): void {
    const requestBody = this.requestMock.request.body;
    expect(requestBody).toEqual(expectedBody);
  }

  expectQueryParamsToMatchFilter(filter: ISearchTagFilter) {
    const queryParams = this.requestMock.request.params;
    Object.entries(filter).forEach(([key, value]) => {
      expect(queryParams.has(key)).toBeTrue();
      expect(queryParams.get(key)).toEqual(value);
    });
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
