import { GalleryService, IGalleryPhotos, IPhoto } from '@shared/photo-context';
import { ISlide, ISwiperState } from '@shared/swiper-context';
import { firstValueFrom } from 'rxjs';

export class PhotoSelectionLoader {
  private nbPreloadPhotos: number = 2;

  constructor(
    private readonly galleryService: GalleryService,
    private readonly nbSlides: number
  ) {}

  async getInitPhotos(): Promise<IGalleryPhotos> {
    const availablePhotos = await firstValueFrom(
      this.galleryService.galleryPhotos$
    );
    const nbMissingPhotos = this.nbSlides - availablePhotos.all.length;
    if (nbMissingPhotos <= 0) {
      return availablePhotos;
    }
    await this.loadPhotos(nbMissingPhotos);
    return await firstValueFrom(this.galleryService.galleryPhotos$);
  }

  private async loadPhotos(size?: number): Promise<void> {
    return this.galleryService.loadMore(size);
  }

  private async isLoadMoreEnabled(slides: ISlide<IPhoto>[]): Promise<boolean> {
    const shouldTriggerPreload = await this.shouldTriggerPreload(slides);
    return this.galleryService.hasMorePhotosToLoad() && shouldTriggerPreload;
  }

  private async shouldTriggerPreload(
    slides: ISlide<IPhoto>[]
  ): Promise<boolean> {
    const preloadIndex = await this.getPhotoPreloadIndex();
    const lastSlideItemIndex = slides[slides.length - 1].itemIndex;
    return lastSlideItemIndex >= preloadIndex;
  }

  private async getPhotoPreloadIndex(): Promise<number> {
    const photos = await this.getPhotos();
    const lastPhotoIndex = photos.all.length - 1;
    const preloadIndex = lastPhotoIndex - this.nbPreloadPhotos;
    return preloadIndex;
  }

  private async getPhotos(): Promise<IGalleryPhotos> {
    return await firstValueFrom(this.galleryService.galleryPhotos$);
  }

  async onSwiperStateChange(swiperState: ISwiperState<IPhoto>): Promise<void> {
    const isLoadMoreEnabled = await this.isLoadMoreEnabled(swiperState.slides);
    if (!isLoadMoreEnabled) {
      return;
    }
    await this.loadPhotos(this.nbPreloadPhotos);
  }
}
