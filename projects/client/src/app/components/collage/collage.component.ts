import { Component, signal } from '@angular/core';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { firstValueFrom } from 'rxjs';
import { PhotosStripComponent } from '../photos-strip/photos-strip.component';

@Component({
  selector: 'app-collage',
  imports: [PhotosStripComponent],
  templateUrl: './collage.component.html',
})
export class CollageComponent {
  photoSets = signal<IPhoto[][]>([]);

  private photos: IPhoto[] = [];

  constructor(private readonly photoApiService: PhotoApiService) {}

  ngOnInit(): void {
    void this.searchPhoto();
  }

  private async searchPhoto() {
    const photos = await firstValueFrom(this.photoApiService.searchPhoto());
    if (photos instanceof Error) {
      return;
    }
    this.photos = photos || [];
    console.log('photos', photos);
    this.updatePhotoSets();
  }

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
