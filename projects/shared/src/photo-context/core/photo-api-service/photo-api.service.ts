import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ENVIRONMENT_TOKEN,
  ISharedEnvironment,
} from '../../../environment-context';
import { catchError, Observable, map, throwError } from 'rxjs';
import { Buffer } from 'buffer';
import {
  IAddPhotoParams,
  IEditPhotoParams,
  IPhoto,
  IPhotoData,
  ISearchPhotoFilter,
  ISearchPhotoOptions,
} from '../../../photo-context/core/models';
import { ISearchResult } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class PhotoApiService {
  private readonly apiUrl: string;

  constructor(
    @Inject(ENVIRONMENT_TOKEN) private readonly env: ISharedEnvironment,
    private readonly httpClient: HttpClient
  ) {
    this.apiUrl = this.env.phogaApiUrl;
  }

  getPhotoBase(id: IPhoto['_id']): Observable<IPhotoData | undefined | Error> {
    const url = new URL(`${this.apiUrl}/photo/${id}/base`);
    const reqUrl = url.toString();
    return this.httpClient.get<IPhotoData>(reqUrl).pipe(
      map((photo) => {
        photo.metadata = this.getPhotoMetadataFromServerPhoto(photo);
        return photo;
      }),
      catchError(this.handleError)
    );
  }

  private getPhotoMetadataFromServerPhoto(photo: IPhoto): IPhoto['metadata'] {
    if (!photo.metadata) {
      return;
    }
    const titles = photo.metadata.titles;
    if (titles) {
      photo.metadata.titles = titles[0].split(',');
    }
    if (photo.metadata.date) {
      photo.metadata.date = new Date(photo.metadata.date);
    }
    return photo.metadata;
  }

  private handleError(error: HttpErrorResponse): Observable<Error> {
    console.error('error from request:', error);
    throw new Error('An error occurred on the server');
  }

  getPhotoImage(id: IPhoto['_id']): Observable<IPhoto['imageBuffer'] | Error> {
    return this.httpClient
      .get(`${this.apiUrl}/photo/${id}/image`, {
        observe: 'response',
        responseType: 'arraybuffer',
      })
      .pipe(
        map((response: HttpResponse<ArrayBuffer>) => {
          const arrayBuffer = response.body;
          if (!arrayBuffer) {
            throw new Error('no image to display');
          }
          return Buffer.from(arrayBuffer);
        }),
        catchError(this.handleError)
      );
  }

  searchPhoto(params?: {
    filter?: ISearchPhotoFilter;
    options?: ISearchPhotoOptions;
  }): Observable<ISearchResult<IPhoto> | Error> {
    const searchParams = params ? this.getSearchParams(params) : undefined;
    return this.httpClient
      .get<ISearchResult<IPhoto>>(`${this.apiUrl}/photo`, {
        params: searchParams,
      })
      .pipe(
        map((searchResult) => {
          searchResult.hits.forEach((photo) => {
            photo.metadata = this.getPhotoMetadataFromServerPhoto(photo);
            if (photo.imageBuffer) {
              photo.imageBuffer = Buffer.from(photo.imageBuffer);
            }
          });
          return searchResult;
        }),
        catchError(this.handleError)
      );
  }

  private getSearchParams({
    filter,
    options,
  }: {
    filter?: ISearchPhotoFilter;
    options?: ISearchPhotoOptions;
  }) {
    let params: any = {};

    if (filter) {
      params = { ...filter };
    }
    if (options?.rendering) {
      params = { ...params, ...options?.rendering };
    }
    if (options?.excludeImages !== undefined) {
      params.excludeImages = options?.excludeImages;
    }
    return params;
  }

  addPhoto(addPhotoParams: IAddPhotoParams): Observable<unknown> {
    const url = new URL(`${this.apiUrl}/admin/photo`);
    const formData = this.getFormDataFromPhoto(addPhotoParams);
    return this.httpClient.post(url.toString(), formData, {
      responseType: 'arraybuffer',
    });
  }

  editPhoto(editPhotoParams: IEditPhotoParams): Observable<unknown> {
    const url = new URL(`${this.apiUrl}/admin/photo`);
    const formData = this.getFormDataFromPhoto(editPhotoParams);
    return this.httpClient.put(url.toString(), formData, {
      responseType: 'arraybuffer',
    });
  }

  private getFormDataFromPhoto(addPhotoParams: IAddPhotoParams): FormData {
    const formData = new FormData();
    formData.append('_id', addPhotoParams._id);
    if (addPhotoParams.imageBuffer) {
      const file = new File([addPhotoParams.imageBuffer!.buffer], 'image');
      formData.append('image', file);
    }
    if (addPhotoParams.metadata?.date) {
      const isoString = addPhotoParams.metadata.date.toISOString();
      formData.append('date', isoString);
    }
    if (addPhotoParams.metadata?.description) {
      formData.append('description', addPhotoParams.metadata.description);
    }
    if (addPhotoParams.metadata?.location) {
      formData.append('location', addPhotoParams.metadata.location);
    }
    if (addPhotoParams.metadata?.titles) {
      formData.append('titles', addPhotoParams.metadata.titles.join(','));
    }
    if (addPhotoParams.tagIds) {
      formData.append('tagIds', addPhotoParams.tagIds.join(','));
    }
    return formData;
  }

  deletePhoto(id: IPhoto['_id']): Observable<unknown> {
    const url = new URL(`${this.apiUrl}/admin/photo/${id}`);
    return this.httpClient.delete(url.toString(), {
      responseType: 'arraybuffer',
    });
  }
}
