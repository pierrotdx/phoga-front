import { InjectionToken, Provider } from '@angular/core';
import { PhotoSelectorService, IPhotoSelectorService } from '../../core';

export const PHOTO_SELECTOR_SERVICE_TOKEN =
  new InjectionToken<IPhotoSelectorService>('PhotoSelectorService');

export const PhotoSelectorServiceProvider: Provider = {
  provide: PHOTO_SELECTOR_SERVICE_TOKEN,
  useClass: PhotoSelectorService,
};
