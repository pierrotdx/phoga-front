import { Injectable } from '@angular/core';
import {
  Gallery,
  IGallery,
  IGalleryService,
  ISearchPhotoFilter,
  PhotoApiService,
} from '../';
import { clone } from 'ramda';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryService implements IGalleryService {
  private readonly galleries: IGallery[] = [];

  private readonly _selectedGallery$ = new BehaviorSubject<
    IGallery | undefined
  >(undefined);
  selectedGallery$ = this._selectedGallery$.asObservable();

  constructor(private readonly photoApiService: PhotoApiService) {}

  create(id: string, filter?: ISearchPhotoFilter): void {
    const galleryToAdd = new Gallery(this.photoApiService, id, filter);
    this.galleries.push(galleryToAdd);
  }

  get(id: string): IGallery | undefined {
    return this.galleries.find((g) => g._id === id);
  }

  getAll(): IGallery[] {
    return clone(this.galleries);
  }

  select(id: IGallery['_id']): void {
    const gallery = this.get(id);
    this._selectedGallery$.next(gallery);
  }

  deselect(): void {
    this._selectedGallery$.next(undefined);
  }
}
