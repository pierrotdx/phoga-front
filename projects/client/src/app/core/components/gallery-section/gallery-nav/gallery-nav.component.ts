import {
  Component,
  computed,
  EventEmitter,
  Output,
  resource,
  signal,
} from '@angular/core';
import { ITag, TagApiService } from '@shared/tag-context';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gallery-nav',
  imports: [],
  templateUrl: './gallery-nav.component.html',
  styleUrl: './gallery-nav.component.scss',
})
export class GalleryNavComponent {
  constructor(private readonly tagApiService: TagApiService) {}

  tagsResource = resource({
    loader: () => firstValueFrom(this.tagApiService.search()),
  });

  tags = computed(() => this.computeTags());

  selectedNavItem = signal<ITag['_id'] | undefined>(undefined);
  @Output() selectedTag = new EventEmitter<ITag['_id'] | undefined>();

  private computeTags(): ITag[] {
    const result = this.tagsResource.value();
    if (result instanceof Error) {
      throw result;
    }
    return result || [];
  }

  selectNavItem(id?: ITag['_id']): void {
    this.selectedNavItem.set(id);
    this.selectedTag.emit(id);
  }
}
