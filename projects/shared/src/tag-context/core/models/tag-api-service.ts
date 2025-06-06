import { Observable } from 'rxjs';
import { ISearchTagFilter } from './search-tag-filter';
import { ITag } from './tag';
import { ISearchResult } from '@shared/models';

export interface ITagApiService {
  search(filter?: ISearchTagFilter): Observable<ISearchResult<ITag> | Error>;
  get(id: ITag['_id']): Observable<ITag | Error>;
  delete(id: ITag['_id']): Observable<void | Error>;
  add(tag: ITag): Observable<void | Error>;
  replace(tag: ITag): Observable<void | Error>;
}
