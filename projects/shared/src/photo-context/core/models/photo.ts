import { Buffer } from 'buffer';
import { IPhotoMetadata } from './photo-metadata';
import { IPhotoBase } from './photo-base';

export interface IPhoto extends IPhotoBase {
  imageBuffer?: Buffer;
}

export class Photo implements IPhoto {
  metadata?: IPhotoMetadata;
  imageBuffer?: Buffer;

  constructor(
    public readonly _id: string,
    data?: {
      metadata?: IPhoto['metadata'];
      imageBuffer?: IPhoto['imageBuffer'];
    }
  ) {
    if (data?.metadata) {
      this.metadata = data.metadata;
    }
    if (data?.imageBuffer) {
      this.imageBuffer = data.imageBuffer;
    }
  }
}
