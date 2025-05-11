import { PhotoApiService } from '@shared/public-api';
import {
  IGallery,
  IGalleryPhotos,
  IPhoto,
  ISearchPhotoFilter,
  ISearchPhotoOptions,
} from '../models';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ISelectedPhoto } from '../models/selected-photo';

export class Gallery implements IGallery {
  private readonly _galleryPhotos$ = new BehaviorSubject<IGalleryPhotos>({
    all: [],
    lastBatch: [],
  });
  readonly galleryPhotos$: Observable<IGalleryPhotos> =
    this._galleryPhotos$.asObservable();

  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  private from: number = 0;
  readonly defaultSize: number = 3;
  private hasMoreToLoad: boolean = true;

  private readonly _selectedPhoto$ = new BehaviorSubject<ISelectedPhoto>(
    undefined
  );
  readonly selectedPhoto$ = this._selectedPhoto$.asObservable();

  constructor(
    private readonly photoApiService: PhotoApiService,
    private readonly filter?: ISearchPhotoFilter
  ) {}

  async loadMore(size?: number): Promise<void> {
    // 1 query at a time (might need queue?)
    const isAlreadyLoading = this.isLoading$.getValue();
    if (!this.hasMorePhotosToLoad() || isAlreadyLoading) {
      return;
    }
    this.isLoading$.next(true);
    try {
      const searchOptions = this.getSearchPhotoOptions(size);
      const loadedPhotos = await this.loadPhotosFromServer(searchOptions);
      this.onPhotoLoading(searchOptions, loadedPhotos);
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

  private async loadPhotosFromServer(
    options?: ISearchPhotoOptions
  ): Promise<IPhoto[]> {
    const loadRequest$ = this.photoApiService.searchPhoto({
      filter: this.filter,
      options,
    });
    const result = await firstValueFrom(loadRequest$);
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }

  private onPhotoLoading(
    searchPhotoOptions: ISearchPhotoOptions,
    loadedPhotos: IPhoto[]
  ): void {
    if (loadedPhotos.length > 0) {
      this.updateGalleryPhotos(loadedPhotos);
      this.updateFrom(loadedPhotos.length + 1);
    }
    this.updateHasMoreToLoad(searchPhotoOptions, loadedPhotos);
  }

  private updateFrom(step: number): void {
    this.from += step;
  }

  private updateGalleryPhotos(photosToAdd: IPhoto[]): void {
    const currentGalleryPhotos = this._galleryPhotos$.getValue();
    const newGalleryPhotos: IGalleryPhotos = {
      all: currentGalleryPhotos.all.concat(photosToAdd),
      lastBatch: photosToAdd,
    };
    this._galleryPhotos$.next(newGalleryPhotos);
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
    this._selectedPhoto$.next(selectedPhoto);
  }

  private findPhoto(photoId: IPhoto['_id']): IPhoto | undefined {
    const photos = this._galleryPhotos$.getValue();
    return photos.all.find((p) => p._id === photoId);
  }

  deselectPhoto = (): void => {
    this._selectedPhoto$.next(undefined);
  };

  hasMorePhotosToLoad = (): boolean => this.hasMoreToLoad;

  async selectNextPhoto(): Promise<void> {
    const allPhotos = this._galleryPhotos$.getValue().all;
    const currentSelectedPhoto = this._selectedPhoto$.getValue();

    if (!currentSelectedPhoto) {
      const firstPhoto = allPhotos[0];
      this.selectPhoto(firstPhoto._id);
      return;
    }

    const selectedPhotoIndex = allPhotos.findIndex(
      (p) => p._id === currentSelectedPhoto._id
    );
    const photoToSelect: IPhoto | undefined = allPhotos[selectedPhotoIndex + 1];
    if (photoToSelect) {
      this.selectPhoto(photoToSelect._id);
      return;
    } else if (this.hasMorePhotosToLoad()) {
      await this.loadMore();
      await this.selectNextPhoto();
    }
  }

  selectPreviousPhoto(): void {
    const allPhotos = this._galleryPhotos$.getValue().all;
    const currentSelectedPhoto = this._selectedPhoto$.getValue();
    const selectedPhotoIndex = allPhotos.findIndex(
      (p) => p._id === currentSelectedPhoto?._id
    );
    if (selectedPhotoIndex === undefined) {
      return;
    }
    const photoToSelect: IPhoto | undefined = allPhotos[selectedPhotoIndex - 1];
    if (photoToSelect) {
      this.selectPhoto(photoToSelect._id);
    }
  }
}
