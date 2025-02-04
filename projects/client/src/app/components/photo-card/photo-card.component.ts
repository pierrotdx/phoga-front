import { AsyncPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';
import { PhotoMetadataComponent } from './photo-metadata/photo-metadata.component';
import { PhotoFullscreenComponent } from './photo-fullscreen/photo-fullscreen.component';
import { MaterialIconComponent } from '@shared/material-icon';

@Component({
  selector: 'app-photo-card',
  imports: [
    BufferToImagePipe,
    AsyncPipe,
    PhotoMetadataComponent,
    MaterialIconComponent,
    PhotoFullscreenComponent,
  ],
  templateUrl: './photo-card.component.html',
})
export class PhotoCardComponent {
  @Input() photo!: IPhoto;
  readonly isFullscreen = signal<boolean>(false);

  toggleFullscreen() {
    const isFullscreen = this.isFullscreen();
    this.isFullscreen.set(!isFullscreen);
  }
}
