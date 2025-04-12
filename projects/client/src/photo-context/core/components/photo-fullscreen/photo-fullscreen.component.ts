import { AsyncPipe } from '@angular/common';
import { Component, Input, model } from '@angular/core';
import {
  OverlayMatIconBtnComponent,
  OverlayPanelComponent,
} from '@shared/overlay-context';
import { Photo } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-fullscreen',
  imports: [
    AsyncPipe,
    BufferToImagePipe,
    OverlayPanelComponent,
    OverlayMatIconBtnComponent,
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
