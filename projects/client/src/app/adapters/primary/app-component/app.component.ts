import { Component, signal } from '@angular/core';
import {
  AboutSectionComponent,
  FooterComponent,
  GallerySectionComponent,
  HeaderComponent,
} from '../../../core';
import { GalleryService } from '@shared/photo-context';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [
    AboutSectionComponent,
    FooterComponent,
    HeaderComponent,
    GallerySectionComponent,
    MatProgressSpinner,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  hasInit = signal<boolean>(false);

  constructor(private readonly galleryService: GalleryService) {
    void this.init();
  }

  private async init(): Promise<void> {
    await this.galleryService.initGalleries();
    this.hasInit.set(true);
  }
}
