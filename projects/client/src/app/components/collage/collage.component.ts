import { Component, Input, signal } from '@angular/core';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { PhotosStripComponent } from '../photos-strip/photos-strip.component';

@Component({
  selector: 'app-collage',
  imports: [PhotosStripComponent],
  templateUrl: './collage.component.html',
})
export class CollageComponent {
  private _photos: IPhoto[] = [];
  @Input() set photos(value: IPhoto[]) {
    this._photos = value || [];
    this.updatePhotoSets();
  }
  get photos() {
    return this._photos;
  }

  photoSets = signal<IPhoto[][]>([]);

  private updatePhotoSets(): void {
    const pairs = this.getPhotoPairs();
    this.photoSets.set(pairs);
  }

  private getPhotoPairs(): IPhoto[][] {
    return this.photos.reduce<IPhoto[][]>((pairs, photo, index) => {
      if (!this.isEvenNb(index)) {
        return pairs;
      }
      const currentPair = [photo];
      const nextPhoto = this.photos[index + 1];
      if (nextPhoto) {
        currentPair.push(nextPhoto);
      }
      pairs.push(currentPair);
      return pairs;
    }, []);
  }

  private isEvenNb(nb: number): boolean {
    return nb % 2 === 0;
  }
}
