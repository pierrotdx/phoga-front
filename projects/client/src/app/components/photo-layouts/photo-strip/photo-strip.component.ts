import { Component, Input } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-photo-strip',
  imports: [PhotoCardComponent],
  templateUrl: './photo-strip.component.html',
  styleUrl: './photo-strip.component.scss',
})
export class PhotoStripComponent {
  @Input() photos: IPhoto[] | undefined;
}
