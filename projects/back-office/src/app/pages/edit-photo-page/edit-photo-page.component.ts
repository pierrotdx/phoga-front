import { AsyncPipe } from '@angular/common';
import { Component, effect, Input, signal } from '@angular/core';
import { IPhoto, Photo, PhotoApiService } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-photo-page',
  imports: [AsyncPipe, BufferToImagePipe],
  templateUrl: './edit-photo-page.component.html',
})
export class EditPhotoPageComponent {
  photo = signal<IPhoto | undefined>(undefined);

  private _photoId: string | undefined;
  @Input('id') set photoId(value: string | undefined) {
    this._photoId = value;
    if (this._photoId) {
      this.getPhoto();
    }
  }
  get photoId(): string | undefined {
    return this._photoId;
  }

  constructor(private readonly photoApiService: PhotoApiService) {
    effect(() => {
      console.log('photo', this.photo());
    });
  }

  private async getPhoto(): Promise<void> {
    const metadata = await this.getMetadata();
    const imageBuffer = await this.getImageBuffer();
    const photo = new Photo(this.photoId!, { metadata, imageBuffer });
    this.photo.set(photo);
  }

  private async getMetadata(): Promise<IPhoto['metadata']> {
    const metadata = await firstValueFrom(
      this.photoApiService.getPhotoMetadata(this.photoId!)
    );
    return metadata instanceof Error ? undefined : metadata;
  }

  private async getImageBuffer(): Promise<IPhoto['imageBuffer']> {
    const imageBuffer = await firstValueFrom(
      this.photoApiService.getPhotoImage(this.photoId!)
    );
    return imageBuffer instanceof Error ? undefined : imageBuffer;
  }
}
