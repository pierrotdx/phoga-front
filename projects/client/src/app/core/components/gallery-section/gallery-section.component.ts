import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionComponent } from '../section/section.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, Subscription } from 'rxjs';
import { GalleryService, IGalleryPhotos, IPhoto } from '@shared/photo-context';
import {
  PhotoCollageComponent,
  PhotoDetailedViewComponent,
} from '../../../../photo-context';
import { OverlayPanelComponent } from '@shared/overlay-context';

@Component({
  selector: 'app-gallery-section',
  imports: [
    AsyncPipe,
    PhotoCollageComponent,
    InfiniteScrollDirective,
    MatProgressSpinner,
    PhotoDetailedViewComponent,
    OverlayPanelComponent,
    SectionComponent,
  ],
  templateUrl: './gallery-section.component.html',
})
export class GallerySectionComponent implements OnInit, OnDestroy {
  readonly photos$: Observable<IGalleryPhotos>;
  isLoading$!: Observable<boolean>;

  readonly selectedPhoto = signal<IPhoto | undefined>(undefined);
  readonly showDetailedView = signal<boolean>(false);

  private readonly subs: Subscription[] = [];
  private readonly initialNbPhotos = 6;

  constructor(private readonly galleryService: GalleryService) {
    this.photos$ = this.galleryService.galleryPhotos$;
    this.isLoading$ = this.galleryService.isLoading$;
  }

  ngOnInit() {
    void this.loadPhotos(this.initialNbPhotos);
    this.subToSelectedPhoto();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  async loadPhotos(size?: number): Promise<void> {
    await this.galleryService.loadMore(size);
  }

  private subToSelectedPhoto(): void {
    const sub = this.galleryService.selectedPhoto$.subscribe((photo) =>
      this.onSelectedPhotoChange(photo)
    );
    this.subs.push(sub);
  }

  private onSelectedPhotoChange(photo: IPhoto | undefined) {
    this.selectedPhoto.set(photo);
    this.showDetailedView.set(!!photo);
  }

  closeDetailedView(): void {
    this.showDetailedView.set(false);
  }
}
