import { Component, input, Input, model } from '@angular/core';
import {
  OverlayMatIconBtnComponent,
  OverlayPanelComponent,
} from '@shared/overlay-context';
import { IPhoto } from '@shared/photo-context';

@Component({
  selector: 'app-photo-fullscreen',
  imports: [OverlayPanelComponent, OverlayMatIconBtnComponent],
  templateUrl: './photo-fullscreen.component.html',
  styleUrl: './photo-fullscreen.component.scss',
})
export class PhotoFullscreenComponent {
  imageUrl = input<IPhoto['imageUrl']>();
  show = model<boolean>(false);

  close(): void {
    this.show.set(false);
  }
}
