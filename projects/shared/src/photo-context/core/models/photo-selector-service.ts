import { BehaviorSubject } from 'rxjs';
import { IPhoto } from './photo';

export interface IPhotoSelector {
  selectedPhoto: BehaviorSubject<IPhoto | undefined>;
}
