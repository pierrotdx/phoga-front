import { Observable } from 'rxjs';
import { ISearchTagFilter } from './search-tag-filter';
import { ITag } from './tag';

export interface ITagApiService {
  search(filter?: ISearchTagFilter): Observable<ITag[] | Error>;
  get(id: ITag['_id']): Observable<ITag | Error>;
  delete(id: ITag['_id']): Observable<void | Error>;
  add(tag: ITag): Observable<void | Error>;
  replace(tag: ITag): Observable<void | Error>;
}
