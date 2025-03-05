import { AsyncPipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { CollageComponent } from '@client/app/components';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, firstValueFrom, Subscription } from 'rxjs';
import {
  IPhoto,
  IPhotoSelector,
  PHOTO_SELECTOR_SERVICE_TOKEN,
  PhotoApiService,
} from '@shared/photo-context';
import { DetailedViewComponent } from '@client/app/components/detailed-view/detailed-view.component';
import { OverlayPanelComponent } from '../../components/overlay-panel/overlay-panel.component';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    CollageComponent,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    MatProgressSpinner,
    DetailedViewComponent,
    OverlayPanelComponent,
  ],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit, OnDestroy {
  readonly photos$ = new BehaviorSubject<IPhoto[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedPhoto = signal<IPhoto | undefined>(undefined);
  readonly showDetailedView = signal<boolean>(false);

  private size = 6;
  private from = 1;
  private hasMoreToLoad = true;
  private readonly subs: Subscription[] = [];

  constructor(
    private readonly photoApiService: PhotoApiService,
    @Inject(PHOTO_SELECTOR_SERVICE_TOKEN)
    private readonly photoSelectorService: IPhotoSelector
  ) {}

  ngOnInit() {
    void this.loadPhotos();
    this.subToSelectedPhoto();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  async loadPhotos() {
    if (!this.isAllowedToLoadPhotos()) {
      return;
    }
    const loadedPhotos = await this.fetchPhotos();
    if (!loadedPhotos) {
      return;
    }
    this.from += loadedPhotos.length;
    this.hasMoreToLoad = loadedPhotos.length === this.size;
    this.updatePhotos(loadedPhotos);
  }

  private isAllowedToLoadPhotos(): boolean {
    // one loading at a time
    return !this.isLoading() && this.hasMoreToLoad;
  }

  private async fetchPhotos() {
    this.isLoading.set(true);
    const result = await firstValueFrom(
      this.photoApiService.searchPhoto({
        rendering: {
          size: this.size,
          from: this.from,
        },
      })
    );
    this.isLoading.set(false);
    if (result instanceof Error) {
      console.error('error', result);
      return;
    }
    return result;
  }

  private updatePhotos(photosToAdd: IPhoto[]): void {
    const photos = this.photos$.getValue().concat(photosToAdd);
    this.photos$.next(photos);
  }

  private subToSelectedPhoto(): void {
    const selectedPhotoSub = this.photoSelectorService.selectedPhoto.subscribe(
      (photo) => this.onSelectedPhotoChange(photo)
    );
    this.subs.push(selectedPhotoSub);
  }

  private onSelectedPhotoChange(photo: IPhoto | undefined) {
    this.selectedPhoto.set(photo);
    this.showDetailedView.set(!!photo);
    console.log('new selected photo', this.selectedPhoto());
  }

  closeDetailedView(): void {
    this.showDetailedView.set(false);
    this.resetSelectedPhoto();
  }

  resetSelectedPhoto(): void {
    this.photoSelectorService.selectedPhoto.next(undefined);
  }
}
