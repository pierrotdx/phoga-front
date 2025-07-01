import { Injectable } from '@angular/core';
import {
  DefaultGalleryId,
  Gallery,
  IGallery,
  IGalleryOptions,
  IGalleryService,
  PhotoApiService,
} from '../';
import { clone } from 'ramda';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { ITag, TagApiService } from '@shared/tag-context';

@Injectable({
  providedIn: 'root',
})
export class GalleryService implements IGalleryService {
  private readonly galleries: IGallery[] = [];

  private readonly _selectedGallery$ = new BehaviorSubject<
    IGallery | undefined
  >(undefined);
  selectedGallery$ = this._selectedGallery$.asObservable();

  defaultGalleryId: string = DefaultGalleryId;

  private readonly nbPreloadedPhotos: number = 10;

  constructor(
    private readonly photoApiService: PhotoApiService,
    private readonly tagApiService: TagApiService
  ) {}

  async initGalleries(): Promise<void> {
    this.createDefaultGallery();
    await this.createGalleriesFromTags();
    await this.preloadPhotos();
    this.select(this.defaultGalleryId);
  }

  private createDefaultGallery(): void {
    const options: IGalleryOptions = { name: 'All' };
    this.create(this.defaultGalleryId, options);
  }

  private async createGalleriesFromTags(): Promise<void> {
    const tags = await this.fetchTags();
    for (const tag of tags) {
      const id = tag._id;
      const options: IGalleryOptions = {
        name: tag.name,
        filter: { tagId: tag._id },
      };
      this.create(id, options);
    }
  }

  private async fetchTags(): Promise<ITag[]> {
    const tags$ = this.tagApiService.search().pipe(
      map((searchResult) => {
        if (searchResult instanceof Error) {
          throw searchResult;
        }
        return searchResult.hits;
      })
    );
    return await firstValueFrom(tags$);
  }

  private async preloadPhotos(): Promise<void> {
    for (const gallery of this.galleries) {
      await gallery.loadMore(this.nbPreloadedPhotos);
    }
  }

  create(id: string, options?: IGalleryOptions): IGallery {
    const alreadyExistingGallery = this.galleries.find((g) => g._id === id);
    if (alreadyExistingGallery) {
      return alreadyExistingGallery;
    }
    const galleryToAdd = new Gallery(this.photoApiService, id, options);
    this.galleries.push(galleryToAdd);
    return galleryToAdd;
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
