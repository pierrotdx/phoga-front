import { Component, Inject, Input } from '@angular/core';
import {
  IPhoto,
  IPhotoSelector,
  PHOTO_SELECTOR_SERVICE_TOKEN,
} from '@shared/photo-context';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { OverlayMatIconBtnComponent } from '../overlay-mat-icon-btn/overlay-mat-icon-btn.component';

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

  constructor(
    @Inject(PHOTO_SELECTOR_SERVICE_TOKEN)
    private readonly photoSelectorService: IPhotoSelector
  ) {}

  seeDetails = () => {
    this.photoSelectorService.selectedPhoto.next(this.photo);
  };
}
