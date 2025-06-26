import { Observable } from 'rxjs';
import { IPhoto } from './photo';
import { IGalleryPhotos } from './gallery-photos';

export interface IGallery {
  _id: string;
  defaultSize: number;
  galleryPhotos$: Observable<IGalleryPhotos>;
  isLoading$: Observable<boolean>;
  loadMore(size?: number): Promise<void>;
  hasMorePhotosToLoad(): boolean;
  totalCount$: Observable<number | undefined>;
  selectedPhoto$: Observable<IPhoto | undefined>;
  selectPhoto(id: IPhoto['_id']): void;
  selectNextPhoto(): Promise<void>;
  selectPreviousPhoto(): void;
  deselectPhoto(): void;
  name?: string;
  description?: string;
}
