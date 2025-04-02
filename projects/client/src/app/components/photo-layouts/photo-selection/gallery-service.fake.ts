import { BehaviorSubject } from 'rxjs';
import { IPhoto, Photo } from '@shared/photo-context';
import { GalleryService } from '../../../services';
import { UuidGenerator } from '@shared/uuid-context';
import { IGalleryPhotos } from '../../../models';

export interface GalleryServiceState {
  nbPhotos: number;
  selectedPhotoIndex?: number;
}

export class FakeGalleryService {
  private readonly galleryServiceSpy = jasmine.createSpyObj<GalleryService>(
    'GalleryService',
    ['loadMore', 'selectPhoto', 'deselectPhoto', 'hasMorePhotosToLoad'],
    {
      photos$: new BehaviorSubject<IGalleryPhotos>({ all: [], lastBatch: [] }),
      selectedPhoto$: new BehaviorSubject<IPhoto | undefined>(undefined),
    }
  );

  private readonly uuidGenerator = new UuidGenerator();

  constructor() {
    this.fakeLoadMorePhotos();
  }

  private fakeLoadMorePhotos(): void {
    this.galleryServiceSpy.loadMore.and.callFake(this.dumbLoadMorePhotos);
  }

  private dumbLoadMorePhotos = async (size: number = 0): Promise<void> => {
    const loadedPhotos = this.generateStubPhotos(size);
    const currentPhotos = this.galleryServiceSpy.photos$.getValue();
    const newPhotos: IGalleryPhotos = {
      all: currentPhotos.all.concat(loadedPhotos),
      lastBatch: loadedPhotos,
    };
    this.galleryServiceSpy.photos$.next(newPhotos);
  };

  private generateStubPhotos(nbPhotos: number): IPhoto[] {
    const photosToEmit = [];
    for (let i = 0; i < nbPhotos; i++) {
      const photo = new Photo(this.uuidGenerator.generate());
      photosToEmit.push(photo);
    }
    return photosToEmit;
  }

  async setupGalleryServiceState(state: GalleryServiceState): Promise<void> {
    const dumbPhotos = this.generateStubPhotos(state.nbPhotos);
    const photos: IGalleryPhotos = { all: dumbPhotos, lastBatch: dumbPhotos };
    this.galleryServiceSpy.photos$.next(photos);

    this.setSelectedPhoto(state.selectedPhotoIndex);
  }

  private setSelectedPhoto(photoIndex: number | undefined): void {
    if (photoIndex === undefined) {
      this.galleryServiceSpy.selectedPhoto$.next(undefined);
      return;
    }
    const photos = this.galleryServiceSpy.photos$.getValue();
    const selectedPhoto = photos.all[photoIndex];
    this.galleryServiceSpy.selectedPhoto$.next(selectedPhoto);
  }

  getSpy() {
    return this.galleryServiceSpy;
  }
}
