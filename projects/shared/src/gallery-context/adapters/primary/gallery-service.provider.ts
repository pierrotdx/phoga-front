import { Provider } from '@angular/core';
import { GalleryService } from '@shared/gallery-context/core';
import { PhotoApiService } from '@shared/photo-context';
import { TagApiService } from '@shared/tag-context';

export const GALLERY_SERVICE_PROVIDER_TOKEN = 'GalleryServiceProviderToken';

export const GalleryServiceProvider: Provider = {
  provide: GALLERY_SERVICE_PROVIDER_TOKEN,
  useClass: GalleryService,
  deps: [PhotoApiService, TagApiService],
};
