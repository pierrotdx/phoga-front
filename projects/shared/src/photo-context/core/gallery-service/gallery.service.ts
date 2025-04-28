import { Injectable } from '@angular/core';
import {
  Gallery,
  IGallery,
  IGalleryPhotos,
  IGalleryService,
  IPhoto,
  PhotoApiService,
} from '@shared/public-api';
import { Observable } from 'rxjs';
import { ISelectedPhoto } from '../models/selected-photo';

@Injectable({
  providedIn: 'root',
})
export class GalleryService implements IGalleryService {
  readonly galleryPhotos$: Observable<IGalleryPhotos>;

  readonly selectedPhoto$: Observable<ISelectedPhoto>;

  isLoading$: Observable<boolean>;

  private readonly gallery!: IGallery;

  constructor(private readonly photoApiService: PhotoApiService) {
    this.gallery = new Gallery(this.photoApiService);
    this.galleryPhotos$ = this.gallery.galleryPhotos$;
    this.selectedPhoto$ = this.gallery.selectedPhoto$;
    this.isLoading$ = this.gallery.isLoading$;
  }

  hasMorePhotosToLoad(): boolean {
    return this.gallery.hasMorePhotosToLoad();
  }

  async loadMore(size?: number): Promise<void> {
    await this.gallery.loadMore(size);
  }

  selectPhoto(id: IPhoto['_id']): void {
    this.gallery.selectPhoto(id);
  }

  deselectPhoto(): void {
    this.gallery.deselectPhoto();
  }
}
