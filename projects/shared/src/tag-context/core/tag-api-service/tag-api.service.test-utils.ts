import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import {
  HttpParams,
  HttpRequest,
  provideHttpClient,
} from '@angular/common/http';
import { ENVIRONMENT_TOKEN } from '@shared/environment-context';
import { TagApiService } from './tag-api.service';
import { ISearchTagFilter } from '../models';

export class TagApiServiceTestUtils {
  private readonly apiBaseUrl = 'http://apiDomain.com';

  private readonly providers = [
    provideHttpClient(),
    provideHttpClientTesting(),
    {
      provide: ENVIRONMENT_TOKEN,
      useValue: { phogaApiUrl: this.apiBaseUrl },
    },
  ];

  private testedService!: TagApiService;
  private httpTestingController!: HttpTestingController;
  private readonly consoleErrorSpy = spyOn(console, 'error');

  private requestMock!: TestRequest;

  globalBeforeEach(): void {
    TestBed.configureTestingModule({ providers: this.providers });
    this.testedService = TestBed.inject(TagApiService);
    this.httpTestingController = TestBed.inject(HttpTestingController);
  }

  globalAfterEach(): void {
    this.verifyNoUnmatchedRequests();
  }

  getTestedService(): TagApiService {
    return this.testedService;
  }

  private verifyNoUnmatchedRequests(): void {
    this.httpTestingController.verify();
  }

  setupRequestMock(relativeUrl: string, params?: any): void {
    const fullUrl = this.getFullUrl(relativeUrl, params);
    this.requestMock = this.httpTestingController.expectOne(fullUrl);
  }

  getFullUrl(relativeUrl: string, params?: any): string {
    const baseUrl = `${this.apiBaseUrl}/${relativeUrl}`;
    const stringParams = params ? this.getHttpParams(params) : undefined;
    return stringParams ? `${baseUrl}?${stringParams}` : baseUrl;
  }

  fakeResponseBody(
    body: Parameters<typeof TestRequest.prototype.flush>[0]
  ): void {
    this.requestMock.flush(body);
  }

  fakeResponseError(): void {
    const errorEvent = new ProgressEvent('testHttpError');
    this.requestMock.error(errorEvent);
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

  private getHttpParams(object: any): HttpParams {
    let params = new HttpParams();
    Object.entries(object).forEach(([key, value]) => {
      params = params.set(key, value as string | boolean | number);
    });
    return params;
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
