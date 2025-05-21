import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  Gallery,
  GalleryService,
  IGallery,
  ISearchPhotoFilter,
  PhotoApiService,
} from '../';
import { firstValueFrom } from 'rxjs';

export class GalleryServiceTestUtils {
  private testedService!: GalleryService;

  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    ['searchPhoto']
  );
  private readonly photoApiServiceProvider: Provider = {
    provide: PhotoApiService,
    useValue: this.fakePhotoApiService,
  };

  globalBeforeEach(): void {
    TestBed.configureTestingModule({
      providers: [this.photoApiServiceProvider],
    });
    this.testedService = TestBed.inject(GalleryService);
  }

  getTestedService(): GalleryService {
    return this.testedService;
  }

  createDumbGallery(id: String): IGallery {
    return new Gallery(this.fakePhotoApiService, 'fake-gallery');
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
}
