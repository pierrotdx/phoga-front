import { Component, effect, input, signal } from '@angular/core';
import { IGallery, IPhoto } from '@shared/photo-context';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import {
  OverlayMatIconBtnComponent,
  OverlayPanelComponent,
} from '@shared/overlay-context';
import { firstValueFrom } from 'rxjs';
import { PhotoDetailedViewComponent } from '../photo-detailed-view/photo-detailed-view.component';

@Component({
  selector: 'app-photo-card',
  imports: [
    PhotoMetadataComponent,
    PhotoImageComponent,
    OverlayMatIconBtnComponent,
    OverlayPanelComponent,
    PhotoDetailedViewComponent,
  ],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  gallery = input.required<IGallery>();

  photoId = input.required<IPhoto['_id']>();

  photo = signal<IPhoto | undefined>(undefined);

  showDetailedView = signal<boolean>(false);

  constructor() {
    effect(async () => await this.setPhoto());
  }

  private async setPhoto(): Promise<void> {
    const photo = await this.getPhotoFromGallery();
    this.photo.set(photo);
  }

  private async getPhotoFromGallery(): Promise<IPhoto> {
    const photoId = this.photoId();
    const gallery = this.gallery();
    const galleryPhotos = await firstValueFrom(gallery.galleryPhotos$);
    const photo = galleryPhotos.all.find((p) => p._id === photoId);
    if (!photo) {
      throw new Error('photo not in gallery');
    }
    return photo;
  }

  select(): void {
    this.gallery().selectPhoto(this.photoId());
    this.showDetailedView.set(true);
  }

  deselect() {
    this.gallery().deselectPhoto();
    this.showDetailedView.set(false);
  }
}
