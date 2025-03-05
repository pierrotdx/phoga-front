import { AsyncPipe } from '@angular/common';
import { Component, Input, model } from '@angular/core';
import { Photo } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';
import { OverlayPanelComponent } from '../overlay-panel/overlay-panel.component';
import { MaterialIconComponent } from '../../../../../shared/src/material-icon-component/material-icon.component';

@Component({
  selector: 'app-photo-fullscreen',
  imports: [
    AsyncPipe,
    BufferToImagePipe,
    OverlayPanelComponent,
    MaterialIconComponent,
  ],
  templateUrl: './photo-fullscreen.component.html',
  styleUrl: './photo-fullscreen.component.scss',
})
export class PhotoFullscreenComponent {
  @Input() imageBuffer: Photo['imageBuffer'];
  show = model<boolean>(false);

  close(): void {
    this.show.set(false);
  }
}
