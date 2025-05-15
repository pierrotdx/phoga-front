import { AsyncPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-image',
  imports: [AsyncPipe, BufferToImagePipe],
  templateUrl: './photo-image.component.html',
  styleUrl: './photo-image.component.scss',
})
export class PhotoImageComponent {
  photo = input.required<IPhoto>();
  showFullscreen = signal<boolean>(false);
}
