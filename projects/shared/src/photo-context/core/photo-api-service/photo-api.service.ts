import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../../../environment-context/adapters/primary/environment-provider';
import { ISharedEnvironment } from '@shared/environment-context';
import { catchError, Observable, map, throwError } from 'rxjs';
import { Buffer } from 'buffer';
import {
  ImageSize,
  IPhoto,
  IPhotoBase,
  IPhotoMetadata,
  ISearchPhotoOptions,
} from '@shared/photo-context/core/models';

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

  getPhotoBase(id: IPhoto['_id']): Observable<IPhotoBase | undefined | Error> {
    const url = new URL(`${this.apiUrl}/photo/${id}/base`);
    const reqUrl = url.toString();
    return this.httpClient.get<IPhotoBase>(reqUrl).pipe(
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
    return throwError(() => new Error('An error occurred on the server'));
  }

  getPhotoImage(
    id: IPhoto['_id'],
    options?: { imageSize: ImageSize }
  ): Observable<IPhoto['imageBuffer'] | Error> {
    const url = new URL(`${this.apiUrl}/photo/${id}/image`);
    if (options?.imageSize) {
      this.addParamsToUrl(url, options?.imageSize);
    }
    const reqUrl = url.toString();
    return this.httpClient
      .get(reqUrl, {
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

  private addParamsToUrl(url: URL, params: object): void {
    Object.entries(params).forEach(([key, value]) => {
      const stringValue = typeof value !== 'string' ? value.toString() : value;
      url.searchParams.append(key, stringValue);
    });
  }

  searchPhoto(options?: ISearchPhotoOptions): Observable<IPhoto[] | Error> {
    const url = new URL(`${this.apiUrl}/photo`);
    if (options?.excludeImages !== undefined) {
      url.searchParams.append('excludeImages', String(options.excludeImages));
    }
    if (options?.rendering) {
      this.addParamsToUrl(url, options.rendering);
    }
    const reqUrl = url.toString();
    return this.httpClient.get<IPhoto[]>(reqUrl).pipe(
      map((photos) => {
        photos.forEach((photo) => {
          photo.metadata = this.getPhotoMetadataFromServerPhoto(photo);
          if (photo.imageBuffer) {
            photo.imageBuffer = Buffer.from(photo.imageBuffer);
          }
        });
        return photos;
      }),
      catchError(this.handleError)
    );
  }

  addPhoto(photo: IPhoto): Observable<unknown> {
    const url = new URL(`${this.apiUrl}/admin/photo`);
    const formData = this.getFormDataFromPhoto(photo);
    return this.httpClient.post(url.toString(), formData, {
      responseType: 'arraybuffer',
    });
  }

  editPhoto(photo: IPhoto): Observable<unknown> {
    const url = new URL(`${this.apiUrl}/admin/photo`);
    const formData = this.getFormDataFromPhoto(photo);
    return this.httpClient.put(url.toString(), formData, {
      responseType: 'arraybuffer',
    });
  }

  private getFormDataFromPhoto(photo: IPhoto): FormData {
    const formData = new FormData();
    formData.append('_id', photo._id);
    if (photo.imageBuffer) {
      const file = new File([photo.imageBuffer!.buffer], 'image');
      formData.append('image', file);
    }
    if (!photo.metadata) {
      return formData;
    }
    if (photo.metadata.date) {
      const isoString = photo.metadata.date.toISOString();
      formData.append('date', isoString);
    }
    if (photo.metadata.description) {
      formData.append('description', photo.metadata.description);
    }
    if (photo.metadata.location) {
      formData.append('location', photo.metadata.location);
    }
    if (photo.metadata.titles) {
      formData.append('titles', photo.metadata.titles.join(','));
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
