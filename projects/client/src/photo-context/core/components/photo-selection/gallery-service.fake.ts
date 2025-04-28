import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  GalleryService,
  IGalleryPhotos,
  IPhoto,
  ISelectedPhoto,
  Photo,
} from '@shared/photo-context';
import { UuidGenerator } from '@shared/uuid-context';

export interface GalleryServiceState {
  nbPhotos: number;
  selectedPhotoIndex?: number;
}

export class FakeGalleryService {
  readonly fakeGalleryPhotos$ = new BehaviorSubject<IGalleryPhotos>({
    all: [],
    lastBatch: [],
  });
  readonly fakeSelectedPhoto$ = new BehaviorSubject<ISelectedPhoto>(
    undefined
  );

  private readonly galleryServiceSpy = jasmine.createSpyObj<GalleryService>(
    'GalleryService',
    ['loadMore', 'selectPhoto', 'deselectPhoto', 'hasMorePhotosToLoad'],
    {
      galleryPhotos$: this.fakeGalleryPhotos$,
      selectedPhoto$: this.fakeSelectedPhoto$,
    }
  );

  private readonly uuidGenerator = new UuidGenerator();

  constructor() {
    this.fakeLoadMorePhotos();
  }

  private fakeLoadMorePhotos(): void {
    this.galleryServiceSpy.loadMore.and.callFake(this.loadPhotosBatch);
  }

  private loadPhotosBatch = async (size: number = 0): Promise<void> => {
    const photosToLoad = this.generateStubPhotos(size);
    const currentGalleryPhotos = this.fakeGalleryPhotos$.getValue();
    const newGalleryPhotos: IGalleryPhotos = {
      all: currentGalleryPhotos.all.concat(photosToLoad),
      lastBatch: photosToLoad,
    };
    this.fakeGalleryPhotos$.next(newGalleryPhotos);
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
    this.fakeGalleryPhotos$.next(photos);

    this.setSelectedPhoto(state.selectedPhotoIndex);
  }

  private setSelectedPhoto(photoIndex: number | undefined): void {
    if (photoIndex === undefined) {
      this.fakeSelectedPhoto$.next(undefined);
      return;
    }
    const photos = this.fakeGalleryPhotos$.getValue();
    const selectedPhoto = photos.all[photoIndex];
    this.fakeSelectedPhoto$.next(selectedPhoto);
  }

  getSpy() {
    return this.galleryServiceSpy;
  }
}
