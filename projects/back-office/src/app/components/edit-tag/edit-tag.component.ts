import { Component, effect, Inject, input, signal } from '@angular/core';
import { EditTagFormComponent } from './edit-tag-form/edit-tag-form.component';
import { ITagVM } from '@back-office/app/models';
import { ITag, TagApiService } from '@shared/tag-context';
import { UUID_PROVIDER_TOKEN, UuidGenerator } from '@shared/uuid-context';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';

@Component({
  selector: 'app-edit-tag',
  imports: [EditTagFormComponent],
  templateUrl: './edit-tag.component.html',
})
export class EditTagComponent {
  id = input<string>();
  tagToEdit = signal<ITag | undefined>(undefined);

  private isTagCreation = true;

  constructor(
    @Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints,
    @Inject(UUID_PROVIDER_TOKEN) readonly uuidGenerator: UuidGenerator,
    private readonly router: Router,
    private readonly tagApiService: TagApiService
  ) {
    effect(() => this.onIdInput());
  }

  private onIdInput() {
    const id = this.id();
    if (id) {
      this.isTagCreation = false;
    }
    console.log('received id', id);
  }

  async onSave(viewModel: ITagVM): Promise<void> {
    if (this.isTagCreation) {
      await this.createTag(viewModel);
    } else {
      this.updateTag(viewModel);
    }
  }

  private async createTag(viewModel: ITagVM): Promise<void> {
    const _id = this.uuidGenerator.generate();
    const tag: ITag = { ...viewModel, _id };
    const addTag$ = this.tagApiService.add(tag);
    await firstValueFrom(addTag$);
  }

  private async updateTag(viewModel: ITagVM): Promise<void> {
    const tag: ITag = { ...viewModel, _id: this.id()! };
    const updateTag$ = this.tagApiService.replace(tag);
    await firstValueFrom(updateTag$);
  }

  onCancel(): void {
    this.navigateToHome();
  }

  private navigateToHome() {
    this.router.navigate([
      this.endpoints.getRelativePath(EndpointId.Restricted),
    ]);
  }
}
