import { firstValueFrom } from 'rxjs';
import { ITagApiService } from '../models/tag-api-service';
import { TagApiServiceTestUtils } from './tag-api.service.test-utils';
import { ISearchTagFilter, ITag } from '../models';

describe('TagApiService', () => {
  let testUtils: TagApiServiceTestUtils;
  let testedService: ITagApiService;

  beforeEach(() => {
    testUtils = new TagApiServiceTestUtils();
    testUtils.globalBeforeEach();

    testedService = testUtils.getTestedService();
  });

  afterEach(() => {
    testUtils.globalAfterEach();
  });

  it('should be created', () => {
    expect(testedService).toBeTruthy();
  });

  describe('search', () => {
    const relativeUrl = 'tag/search';

    it('should send a GET request to the API', async () => {
      firstValueFrom(testedService.search());

      testUtils.setupRequestMock(relativeUrl);

      testUtils.expectRequestMethodToBe('GET');
    });

    describe('when there is a search filter', () => {
      const filter: ISearchTagFilter = { name: 'tagName' };

      it("should send the request with search filters as the request's parameters", async () => {
        firstValueFrom(testedService.search(filter));

        testUtils.setupRequestMock(relativeUrl, filter);

        testUtils.expectQueryParamsToMatchFilter(filter);
      });
    });

    describe('when an error occurs', () => {
      it('should log the error in the console and return a user-friendly error', async () => {
        const request$ = firstValueFrom(testedService.search());

        testUtils.setupRequestMock(relativeUrl);

        await testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe('get', () => {
    const id: ITag['_id'] = 'tag-id-01';
    const relativeUrl: string = `tag/${id}`;

    it('should send a GET request to the API', () => {
      firstValueFrom(testedService.get(id));

      testUtils.setupRequestMock(relativeUrl);

      testUtils.expectRequestMethodToBe('GET');
    });

    describe('when an error occurs', () => {
      it('should log the error in the console and return a user-friendly error', async () => {
        const request$ = firstValueFrom(testedService.get(id));

        testUtils.setupRequestMock(relativeUrl);

        await testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe('delete', () => {
    const id: ITag['_id'] = 'tag-id-to-delete';
    const relativeUrl = `admin/tag/${id}`;

    it('should send a DELETE request to the API', () => {
      firstValueFrom(testedService.delete(id));

      testUtils.setupRequestMock(relativeUrl);

      testUtils.expectRequestMethodToBe('DELETE');
    });

    describe('when an error occurs', () => {
      it('should log the error in the console and return a user-friendly error', async () => {
        const request$ = firstValueFrom(testedService.delete(id));

        testUtils.setupRequestMock(relativeUrl);

        await testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe('add', () => {
    const relativeUrl = 'admin/tag';
    const tagToAdd: ITag = { _id: 'tag-id', name: 'tag to add' };

    it("should send a POST request to the API with the tag to add in the request's body", () => {
      firstValueFrom(testedService.add(tagToAdd));

      testUtils.setupRequestMock(relativeUrl);

      testUtils.expectRequestMethodToBe('POST');
      testUtils.expectRequestBodyToEqual(tagToAdd);
    });

    describe('when an error occurs', () => {
      it('should log the error in the console and return a user-friendly error', async () => {
        const request$ = firstValueFrom(testedService.add(tagToAdd));

        testUtils.setupRequestMock(relativeUrl);

        await testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });

  describe('replace', () => {
    const newTag: ITag = { _id: 'tag-id', name: 'replacing tag' };
    const relativeUrl = `admin/tag`;

    it("should send a PUT request to the API with the new tag value in the request's body", () => {
      firstValueFrom(testedService.replace(newTag));

      testUtils.setupRequestMock(relativeUrl);

      testUtils.expectRequestMethodToBe('PUT');
      testUtils.expectRequestBodyToEqual(newTag);
    });

    describe('when an error occurs', () => {
      it('should log the error in the console and return a user-friendly error', async () => {
        const request$ = firstValueFrom(testedService.replace(newTag));

        testUtils.setupRequestMock(relativeUrl);

        await testUtils.fakeResponseErrorAndExpectErrorHandling(request$);
      });
    });
  });
});
