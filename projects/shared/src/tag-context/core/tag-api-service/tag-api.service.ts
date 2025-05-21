import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ISearchTagFilter, ITag, ITagApiService } from '../models';
import {
  ENVIRONMENT_TOKEN,
  ISharedEnvironment,
} from '../../../environment-context';
import { catchError, Observable } from 'rxjs';

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
    return this.httpClient
      .get<ITag[]>(`${this.baseUrl}/search`, { params: { ...filter } })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<Error> {
    console.error('error from request:', error);
    throw new Error('An error occurred on the server');
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
      .put<void>(`${this.adminBaseUrl}`, tag)
      .pipe(catchError(this.handleError));
  }
}
