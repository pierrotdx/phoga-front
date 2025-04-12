import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SectionComponent } from '../section/section.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IPhoto } from '@shared/photo-context';
import {
  PhotoCollageComponent,
  IGalleryPhotos,
  PhotoDetailedViewComponent,
  GalleryService,
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
  readonly photos$: BehaviorSubject<IGalleryPhotos>;
  isLoading$!: Subject<boolean>;

  readonly selectedPhoto = signal<IPhoto | undefined>(undefined);
  readonly showDetailedView = signal<boolean>(false);

  private readonly subs: Subscription[] = [];
  private readonly initialNbPhotos = 6;

  constructor(private readonly galleryService: GalleryService) {
    this.photos$ = this.galleryService.photos$;
  }

  ngOnInit() {
    this.isLoading$ = this.galleryService.isLoading$;
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
    const selectedPhotoSub = this.galleryService.selectedPhoto$.subscribe(
      (photo) => this.onSelectedPhotoChange(photo)
    );
    this.subs.push(selectedPhotoSub);
  }

  private onSelectedPhotoChange(photo: IPhoto | undefined) {
    this.selectedPhoto.set(photo);
    this.showDetailedView.set(!!photo);
  }

  closeDetailedView(): void {
    this.showDetailedView.set(false);
  }
}
