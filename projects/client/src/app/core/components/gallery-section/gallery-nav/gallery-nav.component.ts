import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Output,
  resource,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { OverlayPanelComponent } from '@shared/overlay-context';
import { ISelectedTag, ITag, TagApiService } from '@shared/tag-context';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-gallery-nav',
  imports: [OverlayPanelComponent, MaterialIconComponent, NgTemplateOutlet],
  templateUrl: './gallery-nav.component.html',
  styleUrl: './gallery-nav.component.scss',
})
export class GalleryNavComponent {
  tagsResource = resource({
    loader: () => firstValueFrom(this.tagApiService.search()),
  });

  tags = computed(() => this.computeTags());

  selectedTag = signal<ISelectedTag>(undefined);
  @Output() selectedTagChange = new EventEmitter<ISelectedTag>();

  expandPanel = signal<boolean>(false);

  readonly noSelectionPlaceHolder = 'All';
  menuTriggerPlaceHolder = signal<string>(this.noSelectionPlaceHolder);

  isMobile: Signal<boolean>;

  constructor(
    private readonly tagApiService: TagApiService,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.isMobile = toSignal(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .pipe(map((state) => state.matches)),
      { initialValue: true }
    );
  }

  private computeTags(): ITag[] {
    const result = this.tagsResource.value();
    if (result instanceof Error) {
      throw result;
    }
    return result || [];
  }

  selectNavItem(tag?: ITag): void {
    this.selectedTag.set(tag);
    this.menuTriggerPlaceHolder.set(
      tag ? tag.name || tag._id : this.noSelectionPlaceHolder
    );
    this.selectedTagChange.emit(tag);
    this.closePanel();
  }

  private closePanel(): void {
    this.expandPanel.set(false);
  }

  togglePanel(): void {
    const currentValue = this.expandPanel();
    this.expandPanel.set(!currentValue);
  }
}
