import { Component, Input } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';

@Component({
  selector: 'app-photo-card',
  imports: [PhotoMetadataComponent, PhotoImageComponent],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  @Input() photo: IPhoto | undefined;
}
