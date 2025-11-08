import { Observable } from 'rxjs';
import { IGallery } from './gallery';
import { IGalleryOptions } from './gallery-options';

export interface IGalleryService {
  selectedGallery$: Observable<IGallery | undefined>;
  create(id: string, options?: IGalleryOptions): IGallery;
  get(id: string): IGallery | undefined;
  getAll(): IGallery[];
  select(id: IGallery['_id']): void;
  deselect(): void;
  initGalleries(): Promise<void>;
  defaultGalleryId: string;
}
