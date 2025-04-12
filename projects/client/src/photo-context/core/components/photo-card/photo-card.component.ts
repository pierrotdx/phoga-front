import { Component, Input } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { GalleryService } from '../../';
import { OverlayMatIconBtnComponent } from '@shared/overlay-context';

@Component({
  selector: 'app-photo-card',
  imports: [
    PhotoMetadataComponent,
    PhotoImageComponent,
    OverlayMatIconBtnComponent,
  ],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  @Input() photo: IPhoto | undefined;

  constructor(private readonly galleryService: GalleryService) {}

  seeDetails = () => {
    this.galleryService.selectedPhoto$.next(this.photo);
  };
}
