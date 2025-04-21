import { TestRequest } from '@angular/common/http/testing';

export interface IApiServiceTestUtils<TService> {
  getTestedService(): TService;
  setupRequestMock(relativeUrl: string, params?: any): void;
  fakeResponseBody(
    body: Parameters<typeof TestRequest.prototype.flush>[0]
  ): void;
  fakeResponseError(): void;
}
