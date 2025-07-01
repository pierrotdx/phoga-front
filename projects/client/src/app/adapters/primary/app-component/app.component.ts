import { Component, OnInit, signal } from '@angular/core';
import {
  AboutSectionComponent,
  FooterComponent,
  GallerySectionComponent,
  HeaderComponent,
  LandingSectionComponent,
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
    LandingSectionComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  hasInit = signal<boolean>(false);

  constructor(private readonly galleryService: GalleryService) {}

  ngOnInit(): void {
    void this.init();
  }

  private async init(): Promise<void> {
    await this.galleryService.initGalleries();
    this.hasInit.set(true);
  }
}
