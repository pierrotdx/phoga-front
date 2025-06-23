import { Component, input, signal } from '@angular/core';
import { IPhoto } from '@shared/photo-context';

@Component({
  selector: 'app-photo-image',
  templateUrl: './photo-image.component.html',
  styleUrl: './photo-image.component.scss',
})
export class PhotoImageComponent {
  photo = input.required<IPhoto>();
  showFullscreen = signal<boolean>(false);
}
