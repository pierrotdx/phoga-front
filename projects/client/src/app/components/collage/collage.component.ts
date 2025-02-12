import { Component, signal } from '@angular/core';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { firstValueFrom } from 'rxjs';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-collage',
  imports: [PhotoCardComponent],
  templateUrl: './collage.component.html',
})
export class CollageComponent {
  photos = signal<IPhoto[] | undefined>(undefined);

  constructor(private readonly photoApiService: PhotoApiService) {}

  ngOnInit(): void {
    void this.searchPhoto();
  }

  private async searchPhoto() {
    const photos = await firstValueFrom(this.photoApiService.searchPhoto());
    if (photos instanceof Error) {
      return;
    }
    this.photos.set(photos);
    console.log(
      'photos',
      this.photos()?.map((p) => p._id)
    );
  }
}
