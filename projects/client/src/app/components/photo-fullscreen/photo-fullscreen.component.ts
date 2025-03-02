import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  model,
  Output,
  signal,
} from '@angular/core';
import { Photo } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-photo-fullscreen',
  imports: [AsyncPipe, BufferToImagePipe, OverlayComponent],
  templateUrl: './photo-fullscreen.component.html',
  styleUrl: './photo-fullscreen.component.scss',
})
export class PhotoFullscreenComponent {
  @Input() imageBuffer: Photo['imageBuffer'];
  show = model<boolean>(false);
}
