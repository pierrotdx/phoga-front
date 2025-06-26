import {
  Component,
  effect,
  EventEmitter,
  input,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import { IGallery, ISelectedPhoto } from '@shared/photo-context';
import { PhotoSelectionComponent } from '../photo-selection/photo-selection.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { Subject, Subscription } from 'rxjs';
import { OverlayMatIconBtnComponent } from '@shared/overlay-context';
import { GalleryPaginationComponent } from '../gallery-pagination/gallery-pagination.component';

@Component({
  selector: 'app-photo-detailed-view',
  imports: [
    PhotoSelectionComponent,
    PhotoMetadataComponent,
    PhotoImageComponent,
    PhotoFullscreenComponent,
    MaterialIconComponent,
    OverlayMatIconBtnComponent,
  ],
  templateUrl: './photo-detailed-view.component.html',
  styleUrl: './photo-detailed-view.component.scss',
})
export class PhotoDetailedViewComponent implements OnDestroy {
  gallery = input.required<IGallery>();
  selectedPhoto = signal<ISelectedPhoto>(undefined);
  showFullscreen = signal<boolean>(false);

  @Output() close = new EventEmitter<void>();

  private readonly gallerySubs: Subscription[] = [];
  private readonly subs: Subscription[] = [];

  private readonly selectNextEmitter = new Subject<void>();
  readonly selectNext$ = this.selectNextEmitter.asObservable();

  private readonly selectPreviousEmitter = new Subject<void>();
  readonly selectPrevious$ = this.selectPreviousEmitter.asObservable();

  constructor() {
    effect(() => this.onGalleryChange());
  }

  private onGalleryChange(): void {
    this.clearGallerySubs();

    const gallery = this.gallery();
    this.subToSelectedPhoto(gallery);
  }

  private clearGallerySubs(): void {
    this.gallerySubs.forEach((sub) => sub?.unsubscribe());
  }

  private subToSelectedPhoto(gallery: IGallery): void {
    const sub = gallery.selectedPhoto$.subscribe(this.onSelectedPhoto);
    this.subs.push(sub);
  }

  private onSelectedPhoto = (selectedPhoto: ISelectedPhoto): void => {
    this.selectedPhoto.set(selectedPhoto);
  };

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.clearGallerySubs();
  }

  openFullscreen(): void {
    this.showFullscreen.set(true);
  }

  closeDetailedView(): void {
    this.close.emit();
  }

  selectPrevious(): void {
    this.selectPreviousEmitter.next();
  }

  selectNext(): void {
    this.selectNextEmitter.next();
  }
}
