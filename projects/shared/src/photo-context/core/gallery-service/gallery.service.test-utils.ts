import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  GalleryService,
  IGalleryPhotos,
  PhotoApiService,
} from '@shared/public-api';
import { firstValueFrom, of } from 'rxjs';
import { IPhoto, ISelectedPhoto } from '../models';

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

  private readonly loadPhotosSpy: jasmine.Spy =
    this.fakePhotoApiService.searchPhoto;

  globalBeforeEach(): void {
    TestBed.configureTestingModule({
      providers: [this.photoApiServiceProvider],
    });
    this.testedService = TestBed.inject(GalleryService);
  }

  getTestedService(): GalleryService {
    return this.testedService;
  }

  getLoadPhotosSpy(): jasmine.Spy {
    return this.loadPhotosSpy;
  }

  simulateNextPhotoBatchLoading(photosToLoad: IPhoto[] | Error): void {
    const photosToLoad$ = of(photosToLoad);
    this.loadPhotosSpy.and.returnValue(photosToLoad$);
  }

  async expectGalleryPhotosToBe(expectedValue: IGalleryPhotos): Promise<void> {
    const galleryPhotos = await firstValueFrom(
      this.testedService.galleryPhotos$
    );
    expect(expectedValue).toEqual(galleryPhotos);
  }

  async expectSelectedPhotoToBe(expectedValue: ISelectedPhoto): Promise<void> {
    const selectedPhoto = await firstValueFrom(
      this.testedService.selectedPhoto$
    );
    expect(selectedPhoto).toEqual(expectedValue);
  }
}
