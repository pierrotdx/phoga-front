import { ISearchPhotoFilter } from './search-photo-filter';

export interface IGalleryOptions {
  filter?: ISearchPhotoFilter;
  name?: string;
  description?: string;
}
