import { ISearchPhotoFilter } from '../../../../../shared/src/photo-context/core/models/search-photo-filter';

export interface IGalleryOptions {
  filter?: ISearchPhotoFilter;
  name?: string;
  description?: string;
}
