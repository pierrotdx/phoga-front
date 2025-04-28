import { PhotoSelectionComponent } from './photo-selection.component';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import { ISwiperState, SwiperComponent } from '@shared/swiper-context';
import { GalleryService, IPhoto } from '@shared/photo-context';
import { BehaviorSubject, filter, firstValueFrom, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, effect, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import {
  FakeGalleryService,
  GalleryServiceState,
} from './gallery-service.fake';

@Component({
  selector: 'app-photo-image',
  template: '',
})
export class PhotoImageStubComponent {
  photo = input<IPhoto>();
}

export class PhotoSelectionTestUtils {
  private readonly fakeGalleryService = new FakeGalleryService();

  private readonly config: TestModuleMetadata = {
    imports: [PhotoSelectionComponent, PhotoImageStubComponent],
    providers: [
      {
        provide: GalleryService,
        useValue: this.fakeGalleryService.getSpy(),
      },
    ],
  };

  private readonly selectNext$ = new Subject<void>();
  private readonly selectPrevious$ = new Subject<void>();

  private fixture!: ComponentFixture<PhotoSelectionComponent>;
  private component!: PhotoSelectionComponent;
  private hasInit = new BehaviorSubject<boolean>(false);

  private selectPhotoSpy!: jasmine.Spy;
  private swipeToItemSpy!: jasmine.Spy;
  private photoLoaderOnSwiperStateChangeSpy!: jasmine.Spy;
  private addItemsEmitterSpy!: jasmine.Spy;

  private async internalBeforeEach(
    galleryServiceInitState?: GalleryServiceState
  ): Promise<void> {
    TestBed.configureTestingModule(this.config);
    TestBed.overrideComponent(PhotoSelectionComponent, {
      set: {
        imports: [
          PhotoImageStubComponent,
          MatProgressSpinner,
          SwiperComponent,
          NgClass,
        ],
      },
    });
    if (galleryServiceInitState) {
      await this.fakeGalleryService.setupGalleryServiceState(
        galleryServiceInitState
      );
    }
    await TestBed.compileComponents();
    this.fixture = TestBed.createComponent(PhotoSelectionComponent);
    this.component = this.fixture.componentInstance;
    this.setSpies();
    this.detectChanges();
  }

  private setSpies(): void {
    this.selectPhotoSpy = spyOn(this.component, 'selectPhoto');
    this.swipeToItemSpy = spyOn(this.component as any, 'swipeToItem');
    this.photoLoaderOnSwiperStateChangeSpy = spyOn(
      this.component['photoLoader'],
      'onSwiperStateChange'
    );
    this.addItemsEmitterSpy = spyOn(this.component['addItemsEmitter'], 'next');
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  async globalBeforeEach(
    galleryServiceInitState?: GalleryServiceState
  ): Promise<void> {
    await this.internalBeforeEach(galleryServiceInitState);
    this.subscribeToHasInitPhotos();
  }

  private subscribeToHasInitPhotos(): void {
    TestBed.runInInjectionContext(() => {
      effect(this.onHasInitPhotos);
    });
  }

  private onHasInitPhotos = () => {
    const hasInitPhotos = this.component.hasInitPhotos();
    this.hasInit.next(hasInitPhotos);
  };

  getGalleryServiceSpy() {
    return this.fakeGalleryService.getSpy();
  }

  expectComponentToBeCreated(): void {
    expect(this.component).toBeTruthy();
  }

  getInitPhotos(): IPhoto[] {
    return this.component.initPhotos();
  }

  getNbSlides(): number {
    return this.component.nbSlides;
  }

  getLoadingPlaceHolderElement(): DebugElement {
    return this.getElementByClass('photo-selection__loading');
  }

  private getElementByClass(className: string): DebugElement {
    return this.fixture.debugElement.query(By.css(`.${className}`));
  }

  getSwiperElement(): DebugElement {
    return this.getElementByClass('photo-selection__swiper');
  }

  async waitInitPhotosLoading(): Promise<void> {
    const hasFinishedInitialization$ = this.hasInit.pipe(
      filter((hasInitPhotos) => !!hasInitPhotos)
    );
    await firstValueFrom(hasFinishedInitialization$);
    this.detectChanges();
  }

  getSlideElement(slideIndex: number): DebugElement {
    const swiperElement = this.getSwiperElement();
    return swiperElement.children[slideIndex].children[0];
  }

  getSelectPhotoSpy() {
    return this.selectPhotoSpy;
  }

  private setInput<T>(name: string, value: T): void {
    this.fixture.componentRef.setInput(name, value);
  }

  setSelectNextInput(): void {
    this.setInput('selectNextPhoto$', this.selectNext$.asObservable());
  }

  setSelectPreviousInput(): void {
    this.setInput('selectPreviousPhoto$', this.selectPrevious$.asObservable());
  }

  emitSelectNext(): void {
    this.selectNext$.next();
  }

  emitSelectPrevious(): void {
    this.selectPrevious$.next();
  }

  getSelectedPhoto(): IPhoto | undefined {
    return this.fakeGalleryService.fakeSelectedPhoto$.getValue();
  }

  getPhoto(index: number): IPhoto {
    const photos = this.component['photos$'].getValue();
    return photos.all[index];
  }

  getSelectedPhotoIndex(): number | undefined {
    const selectedPhoto = this.getSelectedPhoto();
    if (!selectedPhoto) {
      return undefined;
    }
    const selectedPhotoIndex = this.component['getPhotoIndex'](selectedPhoto);
    return selectedPhotoIndex;
  }

  resetTestingModule(): void {
    TestBed.resetTestingModule();
  }

  getSwipeToItemSpy() {
    return this.swipeToItemSpy;
  }

  selectPhotoByIndex(photoIndex: number): void {
    const photoToSelect =
      this.fakeGalleryService.fakeGalleryPhotos$.getValue().all[photoIndex];
    this.fakeGalleryService.fakeSelectedPhoto$.next(photoToSelect);
  }

  getPhotoLoaderOnSwiperStateChangeSpy() {
    return this.photoLoaderOnSwiperStateChangeSpy;
  }

  onSwiperStateChange(swiperState: ISwiperState<IPhoto>): void {
    this.component.onSwiperStateChange(swiperState);
  }

  async loadMorePhotos(size?: number): Promise<void> {
    await this.fakeGalleryService.getSpy().loadMore(size);
  }

  getAddItemsEmitterSpy() {
    return this.addItemsEmitterSpy;
  }
}
