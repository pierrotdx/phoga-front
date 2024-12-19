import { Component, Inject, Input, signal } from '@angular/core';
import {
  IPhoto,
  IPhotoMetadata,
  Photo,
  PhotoApiService,
} from '@shared/photo-context';
import { firstValueFrom } from 'rxjs';
import { EditPhotoFormComponent } from '../../components/edit-photo-form/edit-photo-form.component';
import { IPhotoVM } from '@back-office/app/models';
import { IUuidGenerator, UUID_PROVIDER_TOKEN } from '@shared/uuid-context';
import { isEmpty, view } from 'ramda';

@Component({
  selector: 'app-edit-photo-page',
  imports: [EditPhotoFormComponent, EditPhotoFormComponent],
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

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator,
    private readonly photoApiService: PhotoApiService
  ) {}

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

  onSave(viewModel: IPhotoVM): void {
    const newPhoto = this.getPhotoFromVM(viewModel);
    this.photo.set(newPhoto);
  }

  private getPhotoFromVM(viewModel: IPhotoVM): IPhoto {
    const _id = this.photo()?._id || this.uuidGenerator.generate();
    const newPhoto = new Photo(_id);
    const metadata = this.getPhotoMetadataFromVM(viewModel.metadata);
    if (metadata) {
      newPhoto.metadata = metadata;
    }
    if (viewModel.imageBuffer) {
      newPhoto.imageBuffer = viewModel.imageBuffer;
    }
    return newPhoto;
  }

  private getPhotoMetadataFromVM(
    viewModel: IPhotoVM['metadata']
  ): IPhoto['metadata'] | undefined {
    const metadata: IPhotoMetadata = {};
    const titles = viewModel.titles?.map((t) => t.value);
    if (titles?.length) {
      metadata.titles = titles;
    }
    const date = viewModel.date ? new Date(viewModel.date) : undefined;
    if (date) {
      metadata.date = date;
    }
    metadata.description = viewModel.description;
    metadata.location = viewModel.location;
    return isEmpty(metadata) ? undefined : metadata;
  }

  onCancel(): void {
    this.getPhoto();
  }
}
