import { Component, Input, model } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoImageComponent } from '../photo-image/photo-image.component';

@Component({
  selector: 'app-photo-selection',
  imports: [PhotoImageComponent],
  templateUrl: './photo-selection.component.html',
  styleUrl: './photo-selection.component.scss',
})
export class PhotoSelectionComponent {
  @Input() photos: IPhoto[] = [];
  selectedPhoto = model<IPhoto | undefined>(undefined);

  togglePhotoSelection(id: IPhoto['_id']): void {
    if (id === this.selectedPhoto()?._id) {
      this.resetSelection();
    } else {
      const photo = this.photos.find((p) => p._id === id);
      this.selectedPhoto.set(photo);
    }
  }

  private resetSelection(): void {
    this.selectedPhoto.set(undefined);
  }
}
