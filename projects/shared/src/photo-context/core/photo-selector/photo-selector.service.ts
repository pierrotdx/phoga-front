import { BehaviorSubject } from 'rxjs';
import { IPhoto, IPhotoSelector } from '../models';

export class PhotoSelectorService implements IPhotoSelector {
  readonly selectedPhoto = new BehaviorSubject<IPhoto | undefined>(undefined);
}
