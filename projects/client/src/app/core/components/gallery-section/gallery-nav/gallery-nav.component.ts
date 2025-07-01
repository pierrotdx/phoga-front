import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, OnDestroy, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { OverlayPanelComponent } from '@shared/overlay-context';
import { map, Unsubscribable } from 'rxjs';
import {
  DefaultGalleryId,
  GalleryService,
  IGallery,
} from '@shared/photo-context';

@Component({
  selector: 'app-gallery-nav',
  imports: [OverlayPanelComponent, MaterialIconComponent, NgTemplateOutlet],
  templateUrl: './gallery-nav.component.html',
  styleUrl: './gallery-nav.component.scss',
})
export class GalleryNavComponent implements OnDestroy {
  galleries = signal<IGallery[]>([]);

  expandPanel = signal<boolean>(false);

  menuTriggerPlaceHolder = computed<string>(() => {
    const selectedGallery = this.selectedGallery();
    return selectedGallery
      ? selectedGallery.name ?? selectedGallery._id
      : this.noSelectionPlaceHolder;
  });

  readonly noSelectionPlaceHolder = 'No galleries to display';

  isMobile: Signal<boolean>;

  DefaultGalleryId = DefaultGalleryId;
  selectedGallery = signal<IGallery | undefined>(undefined);

  private readonly subs: Unsubscribable[] = [];

  constructor(
    private readonly galleryService: GalleryService,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.isMobile = toSignal(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .pipe(map((state) => state.matches)),
      { initialValue: true }
    );

    const galleries = this.galleryService.getAll();
    this.galleries.set(galleries);

    this.subToSelectedGallery();
  }

  selectNavItem(id: IGallery['_id']): void {
    this.galleryService.select(id);
    this.closePanel();
  }

  private closePanel(): void {
    this.expandPanel.set(false);
  }

  togglePanel(): void {
    const currentValue = this.expandPanel();
    this.expandPanel.set(!currentValue);
  }

  private subToSelectedGallery(): void {
    const sub = this.galleryService.selectedGallery$.subscribe(
      (selectedGallery) => {
        if (!selectedGallery) {
          this.galleryService.select(DefaultGalleryId);
          return;
        }
        this.selectedGallery.set(selectedGallery);
      }
    );
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
