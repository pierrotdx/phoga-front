import { ITag } from '../../../tag-context';
import { IPhoto } from './photo';

export interface IAddPhotoParams extends IPhoto {
  tagIds?: ITag['_id'][];
}
