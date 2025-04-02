import { Component, Input, signal } from '@angular/core';
import { IPhoto } from '@shared/photo-context';
import { PhotoStripComponent } from '../photo-strip/photo-strip.component';

@Component({
  selector: 'app-photo-collage',
  imports: [PhotoStripComponent],
  templateUrl: './photo-collage.component.html',
  styleUrl: './photo-collage.component.scss',
})
export class PhotoCollageComponent {
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
