import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { IGallery, IGalleryPhotos, IPhoto, ISelectedPhoto } from '@shared/photo-context';
import { SubscriptionHandler } from '@shared/subscription-handler-context';

@Component({
  selector: 'app-gallery-pagination',
  imports: [],
  templateUrl: './gallery-pagination.component.html',
  styleUrl: './gallery-pagination.component.scss',
})
export class GalleryPaginationComponent implements OnDestroy {
  gallery = input.required<IGallery>();

  readonly totalCount = signal<number | undefined>(undefined);
  private readonly totalCountSub: SubscriptionHandler<number | undefined>;

  readonly selectedPhoto = signal<ISelectedPhoto>(undefined);
  private readonly selectedPhotoSub: SubscriptionHandler<ISelectedPhoto>;
  readonly selectedPhotoPosition = computed<number | undefined>(() => {
    const selectedPhoto = this.selectedPhoto();
    if (!selectedPhoto) {
      return;
    }
    const selectedPhotoIndex = this.allLoadedPhotos().findIndex(
      (p) => p._id === selectedPhoto._id
    );
    return selectedPhotoIndex >= 0 ? selectedPhotoIndex + 1 : undefined;
  });

  private readonly allLoadedPhotos = signal<IPhoto[]>([]);
  private readonly galleryPhotosSub: SubscriptionHandler<IGalleryPhotos>;

  constructor() {
    this.galleryPhotosSub = new SubscriptionHandler<IGalleryPhotos>(
      this.onGalleryPhotosChange
    );
    this.totalCountSub = new SubscriptionHandler<number | undefined>(
      this.onTotalCountChange
    );
    this.selectedPhotoSub = new SubscriptionHandler<ISelectedPhoto>(
      this.onSelectedPhotoChange
    );

    effect(this.onGalleryChange);
  }

  private readonly onGalleryChange = () => {
    const gallery = this.gallery();
    this.totalCountSub.subscribeTo(gallery.totalCount$);
    this.selectedPhotoSub.subscribeTo(gallery.selectedPhoto$);
    this.galleryPhotosSub.subscribeTo(gallery.galleryPhotos$);
  };

  private readonly onTotalCountChange = (totalCount: number | undefined): void => {
    this.totalCount.set(totalCount);
  };

  private readonly onSelectedPhotoChange = (selectedPhoto: ISelectedPhoto): void => {
    this.selectedPhoto.set(selectedPhoto);
  };

  private readonly onGalleryPhotosChange = (galleryPhotos: IGalleryPhotos) => {
    this.allLoadedPhotos.set(galleryPhotos.all);
  };

  ngOnDestroy(): void {
    this.totalCountSub.unsubscribe();
    this.selectedPhotoSub.unsubscribe();
    this.galleryPhotosSub.unsubscribe();
  }
}
