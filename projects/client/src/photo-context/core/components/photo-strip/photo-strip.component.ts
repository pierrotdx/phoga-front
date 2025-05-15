import { Component, input } from '@angular/core';
import { IGallery, IPhotoStrip } from '@shared/photo-context';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-photo-strip',
  imports: [PhotoCardComponent],
  templateUrl: './photo-strip.component.html',
  styleUrl: './photo-strip.component.scss',
})
export class PhotoStripComponent {
  gallery = input.required<IGallery>();

  strip = input.required<IPhotoStrip>();
}
