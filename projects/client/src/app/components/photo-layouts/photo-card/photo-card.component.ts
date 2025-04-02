import { Component, Input } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { OverlayMatIconBtnComponent } from '../../utils/overlay-mat-icon-btn/overlay-mat-icon-btn.component';
import { GalleryService } from '@client/app/services';

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
