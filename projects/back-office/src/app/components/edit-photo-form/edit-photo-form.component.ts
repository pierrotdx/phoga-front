import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  viewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { IPhoto } from '@shared/photo-context';

import { Subscription } from 'rxjs';
import { IPhotoMetadataVM, IPhotoTitleVM, IPhotoVM } from '../../models';
import { IUuidGenerator, UUID_PROVIDER_TOKEN } from '@shared/uuid-context';

import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { EditImageBufferComponent } from './edit-image-buffer/edit-image-buffer.component';

@Component({
  selector: 'app-edit-photo-form',
  imports: [FormsModule, EditMetadataComponent, EditImageBufferComponent],
  templateUrl: './edit-photo-form.component.html',
})
export class EditPhotoFormComponent {
  private _photo!: IPhoto;

  @Input() set photo(value: IPhoto) {
    this._photo = value;
    this.initViewModel();
  }
  get photo() {
    return this._photo;
  }

  @Output() save = new EventEmitter<IPhotoVM>();
  @Output() cancel = new EventEmitter<void>();

  form = viewChild<NgModel>('editPhotoForm');
  viewModel: IPhotoVM | undefined;

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator
  ) {}

  private initViewModel(): void {
    this.viewModel = {
      metadata: {
        description: this.photo.metadata?.description || '',
        location: this.photo.metadata?.location || '',
        titles: this.getViewModelTitles(),
        date: '',
      },
      imageBuffer: this.photo.imageBuffer || null,
    };
  }

  private getViewModelTitles(): IPhotoMetadataVM['titles'] {
    const titles = this.photo.metadata?.titles || [];
    return titles.map<IPhotoTitleVM>((title) => ({
      id: this.uuidGenerator.generate(),
      value: title,
    }));
  }

  onSubmit(): void {
    this.save.emit(this.viewModel);
  }
}
