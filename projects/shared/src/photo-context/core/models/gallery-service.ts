import { Observable } from 'rxjs';
import { IGallery, ISearchPhotoFilter } from '../models';

export interface IGalleryService {
  selectedGallery$: Observable<IGallery | undefined>;
  create(id: string, filter?: ISearchPhotoFilter): IGallery;
  get(id: string): IGallery | undefined;
  getAll(): IGallery[];
  select(id: IGallery['_id']): void;
  deselect(): void;
  initGalleries(): Promise<void>;
  defaultGalleryId: string;
}

