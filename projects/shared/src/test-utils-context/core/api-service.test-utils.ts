import {
  HttpParams,
  HttpRequest,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
  TestRequest,
} from '@angular/common/http/testing';
import { ProviderToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IApiServiceTestUtils } from './models';

export class ApiServiceTestUtils<TService>
  implements IApiServiceTestUtils<TService>
{
  protected baseProviders = [provideHttpClient(), provideHttpClientTesting()];

  constructor(
    private readonly serviceProviderToken: ProviderToken<TService>,
    protected readonly apiBaseUrl: string
  ) {}

  protected testedService!: TService;
  protected httpTestingController!: HttpTestingController;

  protected requestMock!: TestRequest;

  protected baseOnConfigureTestingModule(): void {
    this.testedService = TestBed.inject(this.serviceProviderToken);
    this.httpTestingController = TestBed.inject(HttpTestingController);
  }

  protected baseGlobalAfterEach(): void {
    this.verifyNoUnmatchedRequests();
  }

  private verifyNoUnmatchedRequests(): void {
    this.httpTestingController.verify();
  }

  getTestedService(): TService {
    return this.testedService;
  }

  setupRequestMock(relativeUrl: string, params?: any): void {
    const fullUrl = this.getFullUrl(relativeUrl, params);
    this.requestMock = this.httpTestingController.expectOne(fullUrl);
  }

  private getFullUrl(relativeUrl: string, params?: any): string {
    const baseUrl = `${this.apiBaseUrl}/${relativeUrl}`;
    const stringParams = params ? this.getHttpParams(params) : undefined;
    return stringParams ? `${baseUrl}?${stringParams}` : baseUrl;
  }

  private getHttpParams(object: any): HttpParams {
    let params = new HttpParams();
    Object.entries(object).forEach(([key, value]) => {
      params = params.set(key, value as string | boolean | number);
    });
    return params;
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

  expectBodyFormDataToEqual(formData1: FormData): void {
    const bodyFormData: FormData = this.requestMock.request.body;
    for (let [key, value] of formData1.entries()) {
      expect(bodyFormData.has(key)).toBeTrue();
      expect(bodyFormData.get(key)).toEqual(value);
    }
    for (let [key, value] of bodyFormData.entries()) {
      expect(formData1.has(key)).toBeTrue();
      expect(formData1.get(key)).toEqual(value);
    }
  }

  expectQueryParamsToBe(expectedQueryParams: any) {
    const queryParams = this.requestMock.request.params;
    Object.entries(expectedQueryParams).forEach(([key, value]) => {
      expect(queryParams.has(key)).toBeTrue();
      expect(queryParams.get(key)).toEqual(value as any);
    });
  }
}
