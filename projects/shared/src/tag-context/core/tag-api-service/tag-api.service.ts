import { Inject, Injectable } from '@angular/core';
import { ITagApiService } from '../models/tag-api-service';
import { ISearchTagFilter, ITag } from '../models';
import {
  ENVIRONMENT_TOKEN,
  ISharedEnvironment,
} from '@shared/environment-context';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { isEmpty } from 'ramda';

@Injectable({ providedIn: 'root' })
export class TagApiService implements ITagApiService {
  private readonly baseUrl: string;
  private readonly adminBaseUrl: string;

  constructor(
    @Inject(ENVIRONMENT_TOKEN) env: ISharedEnvironment,
    private readonly httpClient: HttpClient
  ) {
    this.baseUrl = `${env.phogaApiUrl}/tag`;
    this.adminBaseUrl = `${env.phogaApiUrl}/admin/tag`;
  }

  search(filter?: ISearchTagFilter): Observable<ITag[] | Error> {
    const params = this.getSearchParams(filter);
    return this.httpClient
      .get<ITag[]>(`${this.baseUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<Error> {
    console.error('error from request:', error);
    throw new Error('An error occurred on the server');
  }

  private getSearchParams(filter?: ISearchTagFilter): HttpParams | undefined {
    if (!filter || isEmpty(filter)) {
      return;
    }
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      params = params.set(key, value);
    });
    return params;
  }

  get(id: ITag['_id']): Observable<ITag | Error> {
    return this.httpClient
      .get<ITag>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: ITag['_id']): Observable<void | Error> {
    return this.httpClient
      .delete<void>(`${this.adminBaseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  add(tag: ITag): Observable<void | Error> {
    return this.httpClient
      .post<void>(this.adminBaseUrl, tag)
      .pipe(catchError(this.handleError));
  }

  replace(tag: ITag): Observable<void | Error> {
    return this.httpClient
      .put<void>(`${this.adminBaseUrl}/${tag._id}`, tag)
      .pipe(catchError(this.handleError));
  }
}
