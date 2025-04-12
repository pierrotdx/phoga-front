import { AsyncPipe } from '@angular/common';
import { Component, Inject, Input, signal } from '@angular/core';
import {
  IPhoto,
  IPhotoUtilsService,
  PHOTO_UTILS_SERVICE_TOKEN,
} from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-image',
  imports: [AsyncPipe, BufferToImagePipe],
  templateUrl: './photo-image.component.html',
  styleUrl: './photo-image.component.scss',
})
export class PhotoImageComponent {
  private _photo: IPhoto | undefined;
  @Input() set photo(value: IPhoto | undefined) {
    this._photo = value;
    this.setImageAlt();
  }
  get photo() {
    return this._photo;
  }
  showFullscreen = signal<boolean>(false);

  constructor(
    @Inject(PHOTO_UTILS_SERVICE_TOKEN)
    private readonly photoUtilsService: IPhotoUtilsService
  ) {}

  readonly imageAlt = signal<string | undefined>(undefined);

  private setImageAlt(): void {
    const title = this.photoUtilsService.getTitle(this.photo?.metadata);
    const alt = title || "photo's image";
    this.imageAlt.set(alt);
  }
}
