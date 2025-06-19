import { Component, CUSTOM_ELEMENTS_SCHEMA, resource } from '@angular/core';

import { PhotoImageComponent } from '@client/photo-context';
import { GalleryService } from '@shared/photo-context';

import { GalleryPreviewComponent } from '../gallery-preview/gallery-preview.component';

@Component({
  selector: 'app-landing-section',
  imports: [GalleryPreviewComponent, PhotoImageComponent],
  templateUrl: './landing-section.component.html',
  styleUrl: './landing-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingSectionComponent {
  galleriesResource = resource({
    loader: async () => this.galleryService.getAll(),
  });

  constructor(private readonly galleryService: GalleryService) {}
}
