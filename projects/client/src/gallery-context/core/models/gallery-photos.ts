import { IPhoto } from '@shared/photo-context';

export interface IGalleryPhotos {
  all: IPhoto[];
  lastBatch: IPhoto[];
}
