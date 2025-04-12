import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GalleryService } from './gallery.service';
import { IPhoto, Photo, PhotoApiService } from '@shared/photo-context';
import { of } from 'rxjs';
import { IGalleryPhotos } from '../models';

export class GalleryServiceTestUtils {
  private galleryService!: GalleryService;

  private readonly photoApiServiceProvider: Provider = {
    provide: PhotoApiService,
    useValue: jasmine.createSpyObj<PhotoApiService>('PhotoApiService', [
      'searchPhoto',
    ]),
  };
  private photoApiServiceSpy!: jasmine.SpyObj<PhotoApiService>;

  readonly allStubPhotos = [
    new Photo('dumb photo 1'),
    new Photo('dumb photo 2'),
    new Photo('dumb photo 3'),
    new Photo('dumb photo 4'),
    new Photo('dumb photo 5'),
  ];

  globalBeforeEach(): void {
    TestBed.configureTestingModule({
      providers: [GalleryService, this.photoApiServiceProvider],
    });

    this.galleryService = TestBed.inject(GalleryService);
    this.photoApiServiceSpy = TestBed.inject(
      PhotoApiService
    ) as jasmine.SpyObj<PhotoApiService>;
  }

  getService(): GalleryService {
    const galleryService = TestBed.inject(GalleryService);
    return galleryService;
  }

  expectServiceToBeCreated(): void {
    expect(this.galleryService).toBeTruthy();
  }

  expectServicePhotosToBe(expectedPhotos: IGalleryPhotos): void {
    const photos = this.getPhotos();
    expect(expectedPhotos.all).toEqual(photos.all);
    expect(expectedPhotos.lastBatch).toEqual(expectedPhotos.lastBatch);
  }

  private getPhotos(): IGalleryPhotos {
    return this.galleryService.photos$.getValue();
  }

  stubSearchPhotoResponse(stubValue: IPhoto[] | Error): void {
    const expectedResult = of(stubValue);
    this.photoApiServiceSpy.searchPhoto.and.returnValue(expectedResult);
  }

  getSearchPhotoSpy() {
    return this.photoApiServiceSpy.searchPhoto;
  }

  expectPhotoRequestFromToBe(expectedFrom: number): void {
    const searchPhotoSpy = this.getSearchPhotoSpy();
    expect(searchPhotoSpy).toHaveBeenCalled();

    const searchPhotoOptions = searchPhotoSpy.calls.mostRecent()?.args?.[0];
    expect(searchPhotoOptions?.rendering?.from).toBe(expectedFrom);
  }

  expectPhotoRequestSizeToBe(expectedSize: number): void {
    const searchPhotoSpy = this.getSearchPhotoSpy();
    expect(searchPhotoSpy).toHaveBeenCalled();

    const searchOptions = searchPhotoSpy.calls.mostRecent()?.args?.[0];
    expect(searchOptions?.rendering?.size).toBe(expectedSize);
  }

  expectServicePhotosLengthToBe(expectedLength: number): void {
    const photos = this.getPhotos();
    expect(photos.all.length).toBe(expectedLength);
  }

  getLoadedPhotosBatch(from: number, size: number): IPhoto[] {
    return this.allStubPhotos.slice(from, from + size);
  }

  getIsLoadingEmitterSpy() {
    const service = this.getService();
    return spyOn(service.isLoading$, 'next');
  }

  expectSelectedPhotoToBe(expectedPhotoId: IPhoto['_id'] | undefined): void {
    const selectedPhoto = this.getSelectedPhoto();
    expect(selectedPhoto?._id).toEqual(expectedPhotoId);
  }

  getSelectedPhoto(): IPhoto | undefined {
    const selectedPhoto = this.galleryService.selectedPhoto$.getValue();
    return selectedPhoto;
  }

  stubServicePhotos(stubPhotos: IGalleryPhotos): void {
    this.galleryService.photos$.next(stubPhotos);
  }
}
