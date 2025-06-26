import { ISearchResult } from '@shared/models';
import {
  IGallery,
  IGalleryOptions,
  IGalleryPhotos,
  IPhoto,
  ISearchPhotoFilter,
  ISearchPhotoOptions,
} from '../models';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { ISelectedPhoto } from '../models/selected-photo';
import { PhotoApiService } from '../photo-api-service/photo-api.service';

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

  private _totalCount = new BehaviorSubject<number | undefined>(undefined);
  readonly totalCount$ = this._totalCount.asObservable();

  private readonly _selectedPhoto$ = new BehaviorSubject<ISelectedPhoto>(
    undefined
  );
  readonly selectedPhoto$ = this._selectedPhoto$.asObservable();

  name?: string;
  description?: string;
  filter?: ISearchPhotoFilter;

  constructor(
    private readonly photoApiService: PhotoApiService,
    readonly _id: string,
    private readonly options?: IGalleryOptions
  ) {
    if (options?.name) {
      this.name = options.name;
    }
    if (options?.description) {
      this.description = options.description;
    }
    if (options?.filter) {
      this.filter = options.filter;
    }
  }

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
      this.onPhotoLoading(loadedPhotos);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      this.isLoading$.next(false);
    }
  }

  private getSearchPhotoOptions(size?: number): ISearchPhotoOptions {
    const options: ISearchPhotoOptions = {
      from: this.from,
      size: size || this.defaultSize,
    };
    return options;
  }

  private async loadPhotosFromServer(
    options?: ISearchPhotoOptions
  ): Promise<ISearchResult<IPhoto>> {
    const loadRequest$ = this.photoApiService.searchPhoto({
      filter: this.filter,
      options,
    });
    const searchResult = await firstValueFrom(loadRequest$);
    if (searchResult instanceof Error) {
      throw searchResult;
    }
    return searchResult;
  }

  private onPhotoLoading(searchResult: ISearchResult<IPhoto>): void {
    if (searchResult.hits?.length > 0) {
      this.updateGalleryPhotos(searchResult.hits);
      this.updateFrom(searchResult);
    }
    this._totalCount.next(searchResult.totalCount);
  }

  private updateFrom(searchResult: ISearchResult<IPhoto>): void {
    const delta = searchResult.hits.length + 1;
    this.from += delta;
  }

  private updateGalleryPhotos(photosToAdd: IPhoto[]): void {
    const currentGalleryPhotos = this._galleryPhotos$.getValue();
    const newGalleryPhotos: IGalleryPhotos = {
      all: currentGalleryPhotos.all.concat(photosToAdd),
      lastBatch: photosToAdd,
    };
    this._galleryPhotos$.next(newGalleryPhotos);
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

  hasMorePhotosToLoad = (): boolean => {
    const totalCount = this._totalCount.getValue();
    const hasStartedLoading = totalCount !== undefined;
    if (!hasStartedLoading) {
      return true;
    }
    const nbLoadedPhotos = this._galleryPhotos$.getValue().all.length;
    return nbLoadedPhotos < totalCount;
  };

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
