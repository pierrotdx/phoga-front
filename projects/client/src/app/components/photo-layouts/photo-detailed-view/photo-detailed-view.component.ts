import {
  Component,
  EventEmitter,
  input,
  model,
  Output,
  signal,
} from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoSelectionComponent } from '../photo-selection/photo-selection.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { OverlayMatIconBtnComponent } from '../../utils/overlay-mat-icon-btn/overlay-mat-icon-btn.component';

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
  photo = model<IPhoto | undefined>(undefined);
  photos = input<IPhoto[]>([]);
  showFullscreen = signal<boolean>(false);
  @Output() close = new EventEmitter<void>();

  goFullscreen(): void {
    this.showFullscreen.set(true);
  }

  closeDetailedView(): void {
    this.close.emit();
  }
}
