import { AsyncPipe } from '@angular/common';
import { Component, Input, model } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-selection',
  imports: [AsyncPipe, BufferToImagePipe],
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
