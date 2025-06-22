import { Component, Inject, Input, signal } from '@angular/core';
import { EditPhotoFormComponent } from './edit-photo-form/edit-photo-form.component';
import { IPhotoVM } from '../../../../photo-context/core/models';
import {
  IPhoto,
  PhotoApiService,
  Photo,
  IPhotoMetadata,
  IPhotoData,
  IAddPhotoParams,
  IEditPhotoParams,
} from '@shared/photo-context';
import { UUID_PROVIDER_TOKEN, IUuidGenerator } from '@shared/uuid-context';
import { firstValueFrom } from 'rxjs';
import { isEmpty, view } from 'ramda';
import { Router } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '../../../../endpoints-context';

@Component({
  selector: 'app-edit-photo',
  imports: [EditPhotoFormComponent],
  templateUrl: './edit-photo.component.html',
})
export class EditPhotoComponent {
  photo = signal<IPhoto | undefined>(undefined);

  private _photoId: string | undefined;
  @Input('id') set photoId(value: string | undefined) {
    if (value) {
      this._photoId = value;
      this.fetchPhoto();
    } else {
      this._photoId = this.uuidGenerator.generate();
      this.createPhoto(this._photoId);
      this.isCreation = true;
    }
  }
  get photoId(): string | undefined {
    return this._photoId;
  }

  private isCreation = false;

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator,
    @Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints,
    private readonly photoApiService: PhotoApiService,
    private readonly router: Router
  ) {}

  private createPhoto(id: IPhoto['_id']): void {
    const photo = new Photo(id);
    this.photo.set(photo);
  }

  private async fetchPhoto(): Promise<void> {
    const photoBase = await this.getPhotoBase();
    if (!photoBase) {
      return;
    }
    const photo: IPhoto = { ...photoBase };
    this.photo.set(photo);
  }

  private async getPhotoBase(): Promise<IPhotoData | undefined> {
    const result = await firstValueFrom(
      this.photoApiService.getPhotoBase(this.photoId!)
    );
    return result instanceof Error ? undefined : result;
  }

  async onSave(viewModel: IPhotoVM): Promise<void> {
    const newPhotoParams: IAddPhotoParams | IEditPhotoParams =
      this.getPhotoFromVM(viewModel);
    this.photo.set(newPhotoParams);
    if (this.isCreation) {
      await firstValueFrom(this.photoApiService.addPhoto(newPhotoParams));
    } else {
      await firstValueFrom(this.photoApiService.editPhoto(newPhotoParams));
    }
    this.navigateOut();
  }

  private navigateOut() {
    this.router.navigate([
      this.endpoints.getRelativePath(EndpointId.Restricted),
    ]);
  }

  private getPhotoFromVM(
    viewModel: IPhotoVM
  ): IAddPhotoParams | IEditPhotoParams {
    const _id = this.photo()?._id || this.uuidGenerator.generate();
    const params: IAddPhotoParams | IEditPhotoParams = { _id };
    const metadata = this.getPhotoMetadataFromVM(viewModel.metadata);
    if (metadata) {
      params.metadata = metadata;
    }
    if (viewModel.tagIds) {
      params.tagIds = viewModel.tagIds;
    }
    if (viewModel.imageBuffer) {
      params.imageBuffer = viewModel.imageBuffer;
    }
    return params;
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
    this.fetchPhoto();
  }

  async deletePhoto(): Promise<void> {
    const id = this.photo()?._id;
    if (id) {
      await firstValueFrom(this.photoApiService.deletePhoto(id));
    }
    this.navigateOut();
  }
}
