import { BehaviorSubject } from 'rxjs';
import { IPhoto, IPhotoSelectorService } from '../models';

export class PhotoSelectorService implements IPhotoSelectorService {
  readonly selectedPhoto = new BehaviorSubject<IPhoto | undefined>(undefined);
}
