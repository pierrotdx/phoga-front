import { Injectable } from '@angular/core';
import {
  IPhoto,
  ISearchPhotoOptions,
  PhotoApiService,
} from '@shared/photo-context';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  readonly photos$ = new BehaviorSubject<IPhoto[]>([]);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  private from: number = 0;
  private defaultSize: number = 2;
  private hasMoreToLoad: boolean = true;

  readonly selectedPhoto$ = new BehaviorSubject<IPhoto | undefined>(undefined);

  constructor(private readonly photoApiService: PhotoApiService) {}

  async loadMore(size?: number): Promise<IPhoto[]> {
    // 1 query at a time (might need queue?)
    const isAlreadyLoading = this.isLoading$.getValue();
    if (!this.hasMoreToLoad || isAlreadyLoading) {
      return [];
    }
    this.isLoading$.next(true);
    try {
      const searchPhotoOptions = this.getSearchPhotoOptions(size);
      const loadedPhotos = await this.fetchPhotos(searchPhotoOptions);
      this.onPhotoLoading(searchPhotoOptions, loadedPhotos);
      return loadedPhotos;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      this.isLoading$.next(false);
    }
  }

  private getSearchPhotoOptions(size?: number): ISearchPhotoOptions {
    const options: ISearchPhotoOptions = {
      rendering: {
        from: this.from,
        size: size || this.defaultSize,
      },
    };
    return options;
  }

  private fetchPhotos = async (searchPhotoOptions?: ISearchPhotoOptions) => {
    const loadRequest$ = this.photoApiService.searchPhoto(searchPhotoOptions);
    const result = await firstValueFrom(loadRequest$);
    if (result instanceof Error) {
      throw result;
    }
    return result;
  };

  private onPhotoLoading(
    searchPhotoOptions: ISearchPhotoOptions,
    loadedPhotos: IPhoto[]
  ): void {
    if (loadedPhotos.length > 0) {
      this.updatePhotos(loadedPhotos);
      this.updateFrom(loadedPhotos.length + 1);
    }
    this.updateHasMoreToLoad(searchPhotoOptions, loadedPhotos);
  }

  private updateFrom(step: number): void {
    const fromBefore = this.from;
    this.from += step;
  }

  private updatePhotos(photosToAdd: IPhoto[]): void {
    const photos = this.photos$.getValue();
    const newPhotos = photos.concat(photosToAdd);
    this.photos$.next(newPhotos);
  }

  private updateHasMoreToLoad(
    searchPhotoOptions: ISearchPhotoOptions,
    loadedPhotos: IPhoto[]
  ): void {
    this.hasMoreToLoad =
      loadedPhotos.length === searchPhotoOptions.rendering!.size;
  }

  selectPhoto(id: IPhoto['_id']): void {
    const selectedPhoto = this.findPhoto(id);
    if (!selectedPhoto) {
      return;
    }
    this.selectedPhoto$.next(selectedPhoto);
  }

  private findPhoto(photoId: IPhoto['_id']): IPhoto | undefined {
    const photos = this.photos$.getValue();
    return photos.find((p) => p._id === photoId);
  }

  deselectPhoto(): void {
    this.selectedPhoto$.next(undefined);
  }
}
