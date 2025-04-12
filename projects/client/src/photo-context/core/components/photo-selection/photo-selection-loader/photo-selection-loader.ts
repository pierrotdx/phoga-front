import { GalleryService, IGalleryPhotos } from '../../../';
import { IPhoto } from '@shared/photo-context';
import { ISlide, ISwiperState } from '@shared/swiper-context';

export class PhotoSelectionLoader {
  private nbPreloadPhotos: number = 2;

  constructor(
    private readonly galleryService: GalleryService,
    private readonly nbSlides: number
  ) {}

  async getInitPhotos(): Promise<IGalleryPhotos> {
    const availablePhotos = this.galleryService.photos$.getValue();
    const nbMissingPhotos = this.nbSlides - availablePhotos.all.length;
    if (nbMissingPhotos <= 0) {
      return availablePhotos;
    }
    await this.loadPhotos(nbMissingPhotos);
    return this.galleryService.photos$.getValue();
  }

  private async loadPhotos(size?: number): Promise<void> {
    return this.galleryService.loadMore(size);
  }

  private isLoadMoreEnabled(slides: ISlide<IPhoto>[]): boolean {
    return (
      this.galleryService.hasMorePhotosToLoad() &&
      this.shouldTriggerPreload(slides)
    );
  }

  private shouldTriggerPreload(slides: ISlide<IPhoto>[]): boolean {
    const preloadIndex = this.getPhotoPreloadIndex();
    const lastSlideItemIndex = slides[slides.length - 1].itemIndex;
    return lastSlideItemIndex >= preloadIndex;
  }

  private getPhotoPreloadIndex(): number {
    const lastPhotoIndex = this.getPhotos().all.length - 1;
    const preloadIndex = lastPhotoIndex - this.nbPreloadPhotos;
    return preloadIndex;
  }

  private getPhotos(): IGalleryPhotos {
    return this.galleryService.photos$.getValue();
  }

  async onSwiperStateChange(swiperState: ISwiperState<IPhoto>): Promise<void> {
    if (!this.isLoadMoreEnabled(swiperState.slides)) {
      return;
    }
    await this.loadPhotos(this.nbPreloadPhotos);
  }
}
