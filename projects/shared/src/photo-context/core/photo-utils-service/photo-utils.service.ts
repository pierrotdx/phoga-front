import { Injectable } from '@angular/core';
import { IPhoto, IPhotoUtilsService } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PhotoUtilsService implements IPhotoUtilsService {
  getTitle(metadata: IPhoto['metadata']): string | undefined {
    return metadata?.titles?.[0];
  }
}
