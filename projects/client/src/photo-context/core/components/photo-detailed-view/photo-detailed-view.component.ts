import {
  Component,
  EventEmitter,
  input,
  model,
  Output,
  signal,
} from '@angular/core';
import { IGallery, IPhoto } from '@shared/photo-context';
import { PhotoSelectionComponent } from '../photo-selection/photo-selection.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { Subject } from 'rxjs';
import { OverlayMatIconBtnComponent } from '@shared/overlay-context';

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
export class PhotoDetailedViewComponent {
  gallery = input.required<IGallery>();
  photo = model<IPhoto | undefined>(undefined);
  showFullscreen = signal<boolean>(false);

  @Output() close = new EventEmitter<void>();

  private readonly selectNextEmitter = new Subject<void>();
  readonly selectNext$ = this.selectNextEmitter.asObservable();

  private readonly selectPreviousEmitter = new Subject<void>();
  readonly selectPrevious$ = this.selectPreviousEmitter.asObservable();

  constructor() {}

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
