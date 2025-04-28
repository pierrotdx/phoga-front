import { IGalleryPhotos, IPhoto } from '../models';
import { Observable } from 'rxjs';
import { ISelectedPhoto } from './selected-photo';

export interface IGalleryService {
  galleryPhotos$: Observable<IGalleryPhotos>;
  selectedPhoto$: Observable<ISelectedPhoto>;
  isLoading$: Observable<boolean>;
  selectPhoto(id: IPhoto['_id']): void;
  deselectPhoto(): void;
  loadMore(size?: number): Promise<void>;
  hasMorePhotosToLoad(): boolean;
}
