import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { SectionComponent } from '../section/section.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Subscription } from 'rxjs';
import {
  DefaultGalleryId,
  GalleryService,
  IGallery,
  IPhoto,
} from '@shared/photo-context';

import { GalleryNavComponent } from './gallery-nav/gallery-nav.component';
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
  readonly selectedPhoto = signal<IPhoto | undefined>(undefined);
  readonly showDetailedView = signal<boolean>(false);

  private readonly subs: Subscription[] = [];
  readonly defaultGalleryId = DefaultGalleryId;

  gallery = signal<IGallery | undefined>(undefined);

  constructor(private readonly galleryService: GalleryService) {}

  ngOnInit() {
    this.subToSelectedGallery();
  }

  private subToSelectedGallery(): void {
    const sub = this.galleryService.selectedGallery$.subscribe(
      this.onSelectedGalleryChange
    );
    this.subs.push(sub);
  }

  private readonly onSelectedGalleryChange = (
    gallery: IGallery | undefined
  ): void => {
    if (!gallery) {
      this.galleryService.select(this.defaultGalleryId);
      return;
    }
    this.gallery.set(gallery);
    this.subToSelectedPhoto();
  };

  private subToSelectedPhoto(): void {
    const sub = this.gallery()?.selectedPhoto$.subscribe(
      this.onSelectedPhotoChange
    );
    if (sub) {
      this.subs.push(sub);
    }
  }

  private readonly onSelectedPhotoChange = (photo: IPhoto | undefined) => {
    this.selectedPhoto.set(photo);
    this.showDetailedView.set(!!photo);
  };

  async loadPhotos(size = 4): Promise<void> {
    await this.gallery()?.loadMore(size);
  }

  closeDetailedView(): void {
    this.showDetailedView.set(false);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
