import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT_TOKEN } from '../../../environment-context/adapters/primary/environment-provider';
import { ISharedEnvironment } from '@shared/environment-context';
import { catchError, Observable, tap, map, throwError } from 'rxjs';
import { Buffer } from 'buffer';
import {
  ImageSize,
  IPhoto,
  IPhotoMetadata,
  IRendering,
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

  getPhotoMetadata(
    id: IPhoto['_id']
  ): Observable<IPhotoMetadata | undefined | Error> {
    const url = new URL(`${this.apiUrl}/photo/${id}/metadata`);
    const reqUrl = url.toString();
    return this.httpClient.get<IPhoto>(reqUrl).pipe(
      map((photo) => photo.metadata),
      catchError(this.handleError)
    );
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

  searchPhoto(options?: {
    excludeImages?: boolean;
    rendering?: IRendering;
  }): Observable<IPhoto[] | Error> {
    const url = new URL(`${this.apiUrl}/photo`);
    if (options?.excludeImages !== undefined) {
      url.searchParams.append('excludeImages', String(options.excludeImages));
    }
    if (options?.rendering) {
      this.addParamsToUrl(url, options.rendering);
    }
    const reqUrl = url.toString();
    return this.httpClient
      .get<IPhoto[]>(reqUrl)
      .pipe(catchError(this.handleError));
  }
}
