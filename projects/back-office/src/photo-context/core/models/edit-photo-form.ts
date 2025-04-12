export interface IPhotoVM {
  metadata: IPhotoMetadataVM;
  imageBuffer: Buffer | undefined;
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
