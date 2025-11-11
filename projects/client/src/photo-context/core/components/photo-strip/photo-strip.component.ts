import { Component, input } from '@angular/core';
import { IPhotoStrip } from '@shared/photo-context';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { IGallery } from '@client/gallery-context/core/models';

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
