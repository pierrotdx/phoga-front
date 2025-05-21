import { ITag } from '@shared/tag-context';

export interface IPhotoVM {
  metadata: IPhotoMetadataVM;
  imageBuffer: Buffer | undefined;
  tagIds?: ITag['_id'][];
}

export interface IPhotoMetadataVM {
  description: string;
  location: string;
  titles: IPhotoTitleVM[];
  date: string;
}

export interface IPhotoTitleVM {
  id: string;
  value: string;
}
