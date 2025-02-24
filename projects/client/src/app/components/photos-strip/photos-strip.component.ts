import { Component, Input } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-photos-strip',
  imports: [PhotoCardComponent],
  templateUrl: './photos-strip.component.html',
  styleUrl: './photos-strip.component.scss',
})
export class PhotosStripComponent {
  @Input() photos: IPhoto[] | undefined;
}
