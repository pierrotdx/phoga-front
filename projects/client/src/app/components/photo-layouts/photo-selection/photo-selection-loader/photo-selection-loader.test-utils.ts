import { TestBed } from '@angular/core/testing';
import { GalleryService } from '../../../../services';
import { PhotoSelectionLoader } from './photo-selection-loader';
import {
  FakeGalleryService,
  GalleryServiceState,
} from '../gallery-service.fake';
import { ISlide, ISwiperState } from '@shared/swiper-context';
import { IPhoto, Photo } from '@shared/photo-context';

export class PhotoSelectionLoaderTestUtils {
  private photoSelectionLoader!: PhotoSelectionLoader;

  private readonly fakeGalleryService = new FakeGalleryService();

  private loadPhotosSpy!: jasmine.Spy;

  private initTestingModule(): void {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GalleryService,
          useValue: this.fakeGalleryService,
        },
      ],
    });
  }

  globalBeforeEach({
    nbSlides,
    galleryServiceInitState,
  }: {
    nbSlides: number;
    galleryServiceInitState: GalleryServiceState;
  }): void {
    this.fakeGalleryService.setupGalleryServiceState(galleryServiceInitState);
    this.initTestingModule();
    this.photoSelectionLoader = new PhotoSelectionLoader(
      this.fakeGalleryService.getSpy(),
      nbSlides
    );
    this.loadPhotosSpy = this.fakeGalleryService.getSpy().loadMore;
  }

  async expectNbOfInitPhotosToBeAtLeast(
    expectedNbPhoto: number
  ): Promise<void> {
    const initPhotos = await this.photoSelectionLoader.getInitPhotos();
    expect(initPhotos.all.length).toBeGreaterThanOrEqual(expectedNbPhoto);
  }

  getLoadPhotosSpy() {
    return this.loadPhotosSpy;
  }

  generateDumbSlides(nbSlides: number): ISlide<IPhoto>[] {
    const slides: ISlide<IPhoto>[] = [];
    for (let itemIndex = 0; itemIndex < nbSlides; itemIndex++) {
      const slide: ISlide<IPhoto> = {
        itemIndex,
        value: new Photo(`photo-${itemIndex}`),
      };
      slides.push(slide);
    }
    return slides;
  }

  onSwiperStateChange(swiperState: ISwiperState<IPhoto>): void {
    this.photoSelectionLoader.onSwiperStateChange(swiperState);
  }

  stubHasMoreToLoad(stubValue: boolean): void {
    const hasMoreToLoadSpy =
      this.fakeGalleryService.getSpy().hasMorePhotosToLoad;
    hasMoreToLoadSpy.and.returnValue(stubValue);
  }
}
