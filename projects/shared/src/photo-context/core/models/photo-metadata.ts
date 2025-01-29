import { Buffer } from "buffer";

export interface IPhotoMetadata {
  date?: Date;
  description?: string;
  location?: string;
  titles?: string[];
  thumbnail?: Buffer;
}
