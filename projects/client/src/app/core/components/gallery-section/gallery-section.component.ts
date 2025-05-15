import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';

import { SectionComponent } from '../section/section.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, Subscription } from 'rxjs';
import {
  GalleryService,
  IGallery,
  IGalleryPhotos,
  IPhoto,
} from '@shared/photo-context';

import { GalleryNavComponent } from './gallery-nav/gallery-nav.component';
import { ITag } from '@shared/tag-context';
import { GalleryComponent } from '../../../../photo-context';

@Component({
  selector: 'app-gallery-section',
  imports: [
    InfiniteScrollDirective,
    SectionComponent,
    GalleryNavComponent,
    GalleryComponent,
  ],
  templateUrl: './gallery-section.component.html',
})
export class GallerySectionComponent implements OnInit, OnDestroy {
  photos$!: Observable<IGalleryPhotos>;
  isLoading$!: Observable<boolean>;

  readonly selectedPhoto = signal<IPhoto | undefined>(undefined);
  readonly showDetailedView = signal<boolean>(false);

  private readonly subs: Subscription[] = [];
  private readonly initialNbPhotos = 3;

  selectedTag = signal<ITag['_id'] | undefined>(undefined);

  readonly defaultGalleryId = 'default';

  gallery = signal<IGallery | undefined>(undefined);

  constructor(private readonly galleryService: GalleryService) {
    this.galleryService.create(this.defaultGalleryId);
    this.galleryService.select(this.defaultGalleryId);

    effect(async () => {
      const tagId = this.selectedTag();
      if (!tagId) {
        this.galleryService.select(this.defaultGalleryId);
        return;
      }
      const galleryId = tagId;
      const tagGallery = this.galleryService.get(galleryId);
      if (!!tagGallery) {
        this.galleryService.select(galleryId);
        return;
      }

      this.galleryService.create(galleryId, { tagId });
      this.galleryService.select(galleryId);
    });
  }

  ngOnInit() {
    this.subToSelectedGallery();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private subToSelectedGallery(): void {
    const sub = this.galleryService.selectedGallery$.subscribe(
      (selectedGallery) => this.onSelectedGalleryChange(selectedGallery)
    );
    this.subs.push(sub);
  }

  private onSelectedGalleryChange(gallery: IGallery | undefined): void {
    this.gallery.set(gallery);
    if (!gallery) {
      this.galleryService.select(this.defaultGalleryId);
      return;
    }
    this.photos$ = gallery.galleryPhotos$;
    this.isLoading$ = gallery.isLoading$;
    void this.loadPhotos(this.initialNbPhotos);
    this.subToSelectedPhoto();
  }

  async loadPhotos(size?: number): Promise<void> {
    await this.gallery()?.loadMore(size);
  }

  private subToSelectedPhoto(): void {
    const sub = this.gallery()?.selectedPhoto$.subscribe((photo) =>
      this.onSelectedPhotoChange(photo)
    );
    if (sub) {
      this.subs.push(sub);
    }
  }

  private onSelectedPhotoChange(photo: IPhoto | undefined) {
    this.selectedPhoto.set(photo);
    this.showDetailedView.set(!!photo);
  }

  closeDetailedView(): void {
    this.showDetailedView.set(false);
  }
}
