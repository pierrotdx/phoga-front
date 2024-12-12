import { ImageSize } from './image-size';

export interface IRendering extends ImageSize {
  dateOrder?: SortDirection;
  size?: number;
  from?: number;
}

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}
