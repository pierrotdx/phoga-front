export interface IPhotoVM {
  metadata: IPhotoMetadataVM;
}

export interface IPhotoMetadataVM {
  description: string;
  location: string;
  titles: string[];
}
