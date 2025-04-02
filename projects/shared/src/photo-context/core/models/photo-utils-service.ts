import { IPhoto } from "./photo";

export interface IPhotoUtilsService {
  getTitle: (metadata: IPhoto['metadata']) => string | undefined;
}
