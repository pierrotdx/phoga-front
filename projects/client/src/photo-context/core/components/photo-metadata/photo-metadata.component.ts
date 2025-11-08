import { Component, effect, Inject, input, signal } from '@angular/core';
import { MaterialIconComponent } from '@shared/material-icon-component/material-icon.component';
import {
  IPhoto,
  IPhotoUtilsService,
  PHOTO_UTILS_SERVICE_TOKEN,
} from '@shared/photo-context';

@Component({
  selector: 'app-photo-metadata',
  imports: [MaterialIconComponent],
  templateUrl: './photo-metadata.component.html',
  styleUrl: './photo-metadata.component.scss',
})
export class PhotoMetadataComponent {
  readonly photoMetadata = input<IPhoto['metadata']>();

  readonly title = signal<string | undefined>(undefined);
  readonly description = signal<string | undefined>(undefined);
  readonly location = signal<string | undefined>(undefined);
  readonly date = signal<string | undefined>(undefined);

  constructor(
    @Inject(PHOTO_UTILS_SERVICE_TOKEN)
    private readonly photoUtilsService: IPhotoUtilsService
  ) {
    effect(() => {
      this.updateTitle();
      this.updateDescription();
      this.updateLocation();
      this.updateDate();
    });
  }

  private updateTitle(): void {
    const title = this.photoUtilsService.getTitle(this.photoMetadata());
    this.title.set(title);
  }

  private updateDescription(): void {
    const description = this.photoMetadata()?.description;
    this.description.set(description);
  }

  private updateLocation(): void {
    const location = this.photoMetadata()?.location;
    this.location.set(location);
  }

  private updateDate(): void {
    const date = this.photoMetadata()?.date;
    this.date.set(date ? this.getFormattedStringDate(date) : date);
  }

  private getFormattedStringDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}
