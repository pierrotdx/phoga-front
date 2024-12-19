import { JsonPipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { IPhotoMetadataVM } from '../../../models';
import { IUuidGenerator, UUID_PROVIDER_TOKEN } from '@shared/uuid-context';

@Component({
  selector: 'app-metadata-form',
  imports: [FormsModule, JsonPipe],
  templateUrl: './metadata-form.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class MetadataFormComponent {
  @Input() viewModel!: IPhotoMetadataVM;

  constructor(
    @Inject(UUID_PROVIDER_TOKEN) private readonly uuidGenerator: IUuidGenerator
  ) {
    this.generateUuid();
    this.generateUuid();
    this.generateUuid();
  }

  private generateUuid(): string {
    const uuid = this.uuidGenerator.generate();
    console.log('generated uuid', uuid);
    return uuid;
  }
}
