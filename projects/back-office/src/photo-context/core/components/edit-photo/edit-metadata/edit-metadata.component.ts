import { Component, Inject, Input } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { IPhotoMetadataVM, IPhotoTitleVM } from '../../../models';
import { UUID_PROVIDER_TOKEN, IUuidGenerator } from '@shared/uuid-context';

@Component({
  selector: 'app-edit-metadata',
  imports: [FormsModule],
  templateUrl: './edit-metadata.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class EditMetadataComponent {
  @Input() viewModel!: IPhotoMetadataVM;

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator
  ) {}

  addTitle(): void {
    const newTitle = {
      id: this.uuidGenerator.generate(),
      value: '',
    };
    this.viewModel.titles.push(newTitle);
  }

  removeTitle(id: IPhotoTitleVM['id']): void {
    this.viewModel.titles = this.viewModel.titles.filter((t) => t.id !== id);
  }

  resetDate(): void {
    if (this.viewModel.date) {
      this.viewModel.date = '';
    }
  }
}
