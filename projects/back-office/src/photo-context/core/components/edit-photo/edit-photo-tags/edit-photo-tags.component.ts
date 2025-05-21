import {
  Component,
  computed,
  effect,
  model,
  resource,
  signal,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ITag, TagApiService } from '@shared/tag-context';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-photo-tags',
  imports: [MatProgressSpinner, FormsModule, MatSelectModule],
  templateUrl: './edit-photo-tags.component.html',
})
export class EditPhotoTagsComponent {
  viewModel = model<ITag['_id'][] | undefined>();

  tagsResource = resource({
    loader: () => firstValueFrom(this.tagApiService.search()),
  });
  tags = computed(() => this.computeTags());

  private readonly noTagsPlaceHolder = 'no tags available';
  private readonly selectTagPlaceHolder = 'select a tag';
  placeHolder = signal<string>(this.noTagsPlaceHolder);

  constructor(private readonly tagApiService: TagApiService) {
    effect(() => this.setPlaceHolder());
  }

  private computeTags(): ITag[] {
    const result = this.tagsResource.value();
    if (result instanceof Error) {
      throw result;
    }
    return result || [];
  }

  private setPlaceHolder(): void {
    const tags = this.tags();
    if (!tags?.length) {
      this.placeHolder.set(this.noTagsPlaceHolder);
    } else {
      this.placeHolder.set(this.selectTagPlaceHolder);
    }
  }
}
