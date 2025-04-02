import { InjectionToken, Provider } from '@angular/core';
import { PhotoUtilsService, IPhotoUtilsService } from '../../core';

export const PHOTO_UTILS_SERVICE_TOKEN = new InjectionToken<IPhotoUtilsService>(
  'PhotoUtilsService'
);

export const PhotoUtilsServiceProvider: Provider = {
  provide: PHOTO_UTILS_SERVICE_TOKEN,
  useClass: PhotoUtilsService,
};
