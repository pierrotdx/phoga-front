import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';

import { IPhoto } from '@shared/photo-context';
import { IUuidGenerator, UUID_PROVIDER_TOKEN } from '@shared/uuid-context';
import { IPhotoMetadataVM, IPhotoTitleVM, IPhotoVM } from '../../../models';

import { EditMetadataComponent } from '../edit-metadata/edit-metadata.component';
import { EditImageBufferComponent } from '../edit-image-buffer/edit-image-buffer.component';
import { EditPhotoTagsComponent } from '../edit-photo-tags/edit-photo-tags.component';

@Component({
  selector: 'app-edit-photo-form',
  imports: [
    FormsModule,
    EditMetadataComponent,
    EditImageBufferComponent,
    EditPhotoTagsComponent,
  ],
  templateUrl: './edit-photo-form.component.html',
})
export class EditPhotoFormComponent implements AfterViewInit, OnDestroy {
  private _photo!: IPhoto;
  private readonly subs: Subscription[] = [];

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
  private isImageEditValid = false;
  isValid = signal<boolean>(false);

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator
  ) {}

  ngAfterViewInit(): void {
    const formSub = this.form()?.valueChanges?.subscribe(() => {
      this.updateValidity();
    });
    if (formSub) {
      this.subs.push(formSub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private updateValidity(): void {
    const isValid = !!this.form()?.valid && this.isImageEditValid;
    this.isValid.set(isValid);
  }

  private initViewModel(): void {
    const titles = this.getViewModelTitles();
    this.viewModel = {
      metadata: {
        description: this.photo.metadata?.description ?? '',
        location: this.photo.metadata?.location ?? '',
        titles,
        date: '',
      },
      imageBuffer: this.photo?.imageBuffer,
      tagIds: this.photo.tags?.map((t) => t._id),
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

  onImageBufferValidationChange(isValid: boolean) {
    this.isImageEditValid = isValid;
    this.updateValidity();
  }
}
