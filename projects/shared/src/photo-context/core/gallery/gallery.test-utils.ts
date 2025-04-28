import { PhotoApiService } from '@shared/public-api';
import { IGalleryPhotos, IPhoto } from '../models';
import { Gallery } from './gallery';
import { firstValueFrom, of } from 'rxjs';
import { ISelectedPhoto } from '../models/selected-photo';

export class GalleryTestUtils {
  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    ['searchPhoto']
  );

  private readonly testedClass = new Gallery(this.fakePhotoApiService);

  async getGalleryPhotos(): Promise<IGalleryPhotos> {
    return await firstValueFrom(this.testedClass.galleryPhotos$);
  }

  async expectGalleryPhotosToBe(expectedPhotos: IGalleryPhotos): Promise<void> {
    const galleryPhotos = await this.getGalleryPhotos();
    expect(galleryPhotos.all).toEqual(expectedPhotos.all);
    expect(galleryPhotos.lastBatch).toEqual(expectedPhotos.lastBatch);
  }

  getDefaultSize(): number {
    return this.testedClass.defaultSize;
  }

  simulateNextServerResponse(fakeResponse: IPhoto[] | Error) {
    const fakeResponse$ = of(fakeResponse);
    const spy = this.getServerRequestSpy();
    spy.and.returnValue(fakeResponse$);
  }

  simulateGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.testedClass['_galleryPhotos$'].next(galleryPhotos);
  }

  getServerRequestSpy(): jasmine.Spy {
    return this.fakePhotoApiService.searchPhoto;
  }

  getTestedClass(): Gallery {
    return this.testedClass;
  }

  expectFromRequestParamToBe(expectedFrom: number): void {
    const serverRequestSpy = this.getServerRequestSpy();
    expect(serverRequestSpy).toHaveBeenCalled();

    const searchParams = serverRequestSpy.calls.mostRecent()?.args?.[0];
    expect(searchParams?.options?.rendering?.from).toBe(expectedFrom);
  }

  expectSizeRequestParamToBe(expectedSize: number): void {
    const serverRequestSpy = this.getServerRequestSpy();
    expect(serverRequestSpy).toHaveBeenCalled();

    const searchOptions = serverRequestSpy.calls.mostRecent()?.args?.[0];
    expect(searchOptions?.options?.rendering?.size).toBe(expectedSize);
  }

  async expectSelectedPhotoToBe(
    expectedPhotoId: IPhoto['_id'] | undefined
  ): Promise<void> {
    const selectedPhoto = await this.getSelectedPhoto();
    expect(selectedPhoto?._id).toEqual(expectedPhotoId);
  }

  async getSelectedPhoto(): Promise<ISelectedPhoto> {
    return await firstValueFrom(this.testedClass.selectedPhoto$);
  }
}
