import { ITag } from '../../../tag-context';
import { IPhoto } from './photo';

export interface IAddPhotoParams extends Omit<IPhoto, 'tags'> {
  tagIds?: ITag['_id'][];
}
