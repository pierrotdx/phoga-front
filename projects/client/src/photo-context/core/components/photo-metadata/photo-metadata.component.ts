import { Component, Inject, Input, signal } from '@angular/core';
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
  private _photoMetadata: IPhoto['metadata'] | undefined;

  @Input() set photoMetadata(value: IPhoto['metadata'] | undefined) {
    this._photoMetadata = value || undefined;
    this.updateTitle();
    this.updateDescription();
    this.updateLocation();
    this.updateDate();
  }
  get photoMetadata() {
    return this._photoMetadata;
  }

  title = signal<string | undefined>(undefined);
  description = signal<string | undefined>(undefined);
  location = signal<string | undefined>(undefined);
  date = signal<string | undefined>(undefined);

  constructor(
    @Inject(PHOTO_UTILS_SERVICE_TOKEN)
    private readonly photoUtilsService: IPhotoUtilsService
  ) {}

  private updateTitle(): void {
    const title = this.photoUtilsService.getTitle(this.photoMetadata);
    this.title.set(title);
  }

  private updateDescription(): void {
    const description = this.photoMetadata?.description;
    this.description.set(description);
  }

  private updateLocation(): void {
    const location = this.photoMetadata?.location;
    this.location.set(location);
  }

  private updateDate(): void {
    if (this.photoMetadata?.date) {
      const stringDate = this.getFormattedStringDate(this.photoMetadata.date);
      this.date.set(stringDate);
    } else {
      this.date.set(undefined);
    }
  }

  private getFormattedStringDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}
