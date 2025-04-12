import { Component, effect, Inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ITag, TagApiService } from '@shared/tag-context';
import { UUID_PROVIDER_TOKEN, UuidGenerator } from '@shared/uuid-context';
import { ITagVM } from '../../models';
import { EditTagFormComponent } from '../edit-tag-form/edit-tag-form.component';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '../../../../endpoints-context';

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

  private async onIdInput() {
    const id = this.id();
    this.isTagCreation = !id;
    if (!id) {
      return;
    }
    const inputTag = await this.fetchTag(id);
    this.tagToEdit.set(inputTag);
  }

  private async fetchTag(id: ITag['_id']): Promise<ITag> {
    const result = await firstValueFrom(this.tagApiService.get(id));
    if (result instanceof Error) {
      throw result;
    }
    return result;
  }

  async onSave(viewModel: ITagVM): Promise<void> {
    if (this.isTagCreation) {
      await this.createTag(viewModel);
    } else {
      await this.updateTag(viewModel);
    }
    await this.navigateToTagsPage();
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

  async onCancel(): Promise<void> {
    await this.navigateToTagsPage();
  }

  private async navigateToTagsPage(): Promise<void> {
    const tagsPageUrl = this.endpoints.getFullPath(EndpointId.AdminTag);
    await this.router.navigate([tagsPageUrl]);
  }

  async delete(): Promise<void> {
    const id = this.tagToEdit()?._id;
    if (!id) {
      return;
    }
    await firstValueFrom(this.tagApiService.delete(id));
    await this.navigateToTagsPage();
  }
}
