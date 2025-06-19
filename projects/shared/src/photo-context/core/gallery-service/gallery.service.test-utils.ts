import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Gallery,
  GalleryService,
  IGallery,
  IGalleryOptions,
  ISearchPhotoFilter,
  PhotoApiService,
} from '../';
import { firstValueFrom, of } from 'rxjs';
import { ITag, TagApiService } from '@shared/tag-context';
import { ISearchResult } from '@shared/models';

export class GalleryServiceTestUtils {
  private testedService!: GalleryService;

  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    { searchPhoto: of({ hits: [], totalCount: 0 }) }
  );
  private readonly photoApiServiceProvider: Provider = {
    provide: PhotoApiService,
    useValue: this.fakePhotoApiService,
  };

  private readonly fakeTagApiService = jasmine.createSpyObj<TagApiService>(
    'TagApiService',
    ['search']
  );
  private readonly tagApiServiceProvider: Provider = {
    provide: TagApiService,
    useValue: this.fakeTagApiService,
  };

  globalBeforeEach(): void {
    TestBed.configureTestingModule({
      providers: [this.photoApiServiceProvider, this.tagApiServiceProvider],
    });
    this.testedService = TestBed.inject(GalleryService);
  }

  getTestedService(): GalleryService {
    return this.testedService;
  }

  expectGalleryToBeCreated(id: string, filter?: ISearchPhotoFilter): void {
    const gallery = this.testedService['galleries'].find((g) => g._id === id);
    expect(gallery).toBeTruthy();
    if (filter) {
      expect((gallery as Gallery)['filter']).toEqual(filter);
    }
  }

  expectServiceGalleriesToBe(expectedGalleryIds: IGallery['_id'][]) {
    const serviceGalleries = this.testedService.getAll();
    expect(serviceGalleries.length).toBe(expectedGalleryIds.length);
    expectedGalleryIds.forEach((id) => {
      const gallery = serviceGalleries.find((g) => g._id === id);
      expect(gallery).toBeTruthy();
    });
  }

  async expectSelectedGalleryToBe(
    expectedGalleryId: IGallery['_id'] | undefined
  ): Promise<void> {
    const selectedGallery = await firstValueFrom(
      this.testedService.selectedGallery$
    );
    expect(selectedGallery?._id).toEqual(expectedGalleryId);
  }

  expectNbOfGalleriesToBe(expectedNbGalleries: number): void {
    const nbGalleries = this.testedService.getAll().length;
    expect(nbGalleries).toBe(expectedNbGalleries);
  }

  fakeTagSearch(tags: ITag[]): void {
    const searchResult: ISearchResult<ITag> = {
      hits: tags,
      totalCount: tags.length,
    };
    this.fakeTagApiService.search.and.returnValue(of(searchResult));
  }

  getSpiesOfPhotosPreload(): jasmine.Spy[] {
    const spies: jasmine.Spy[] = [];
    spyOn(this.testedService, 'create').and.callFake(
      this.fakeGalleryCreationAndExtractPhotoPreloadSpy(spies)
    );
    return spies;
  }

  private fakeGalleryCreationAndExtractPhotoPreloadSpy =
    (spies: jasmine.Spy[]) => (id: string, options?: IGalleryOptions) => {
      // fake gallery creation
      const gallery = new Gallery({} as any, id, options);
      this.testedService['galleries'].push(gallery);

      // spy on load more
      const spy = spyOn(gallery, 'loadMore');
      spy.and.resolveTo();
      spy.calls.reset();
      spies.push(spy);

      return gallery;
    };
}
