import { InjectionToken, Provider } from '@angular/core';
import { PhotoSelectorService, IPhotoSelector } from '../../core';

export const PHOTO_SELECTOR_SERVICE_TOKEN = new InjectionToken<IPhotoSelector>(
  'PhotoSelectorService'
);

export const PhotoSelectorServiceProvider: Provider = {
  provide: PHOTO_SELECTOR_SERVICE_TOKEN,
  useClass: PhotoSelectorService,
};
