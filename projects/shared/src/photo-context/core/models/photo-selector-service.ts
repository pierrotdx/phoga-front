import { BehaviorSubject } from 'rxjs';
import { IPhoto } from './photo';

export interface IPhotoSelectorService {
  selectedPhoto: BehaviorSubject<IPhoto | undefined>;
}
