import { PhotoSelectionComponent } from './photo-selection.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwiperComponent } from '@shared/swiper-context';
import {
  Gallery,
  IGallery,
  IPhoto,
  ISearchPhotoOptions,
  PhotoApiService,
} from '@shared/photo-context';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, effect, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';
import { ISearchResult } from '@shared/models';

@Component({
  selector: 'app-photo-image',
  template: '',
})
export class PhotoImageStubComponent {
  photo = input<IPhoto>();
}

export class PhotoSelectionTestUtils {
  private readonly photosToLoad$ = new ReplaySubject<
    ISearchResult<IPhoto> | Error
  >(1);

  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    { searchPhoto: this.photosToLoad$.asObservable() }
  );
  private readonly dumbGallery: IGallery = new Gallery(
    this.fakePhotoApiService,
    'fake gallery'
  );

  private readonly selectNext$ = new Subject<void>();
  private readonly selectPrevious$ = new Subject<void>();

  private fixture!: ComponentFixture<PhotoSelectionComponent>;
  private component!: PhotoSelectionComponent;
  private hasInit = new BehaviorSubject<boolean>(false);

  private selectPhotoSpy!: jasmine.Spy;
  private selectNextPhotoSpy!: jasmine.Spy;
  private selectPreviousPhotoSpy!: jasmine.Spy;
  private readonly addItemsEmittedValues: IPhoto[][] = [];
  private swipeToItemSpy!: jasmine.Spy;
  private hasMorePhotosToLoadSpy!: jasmine.Spy;

  async globalBeforeEach(): Promise<void> {
    TestBed.configureTestingModule({});
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
    await TestBed.compileComponents();
  }

  createComponent(): void {
    this.fixture = TestBed.createComponent(PhotoSelectionComponent);
    this.setInput('gallery', this.dumbGallery);
    this.component = this.fixture.componentInstance;
    this.setSpies();
    this.setSubs();
  }

  private setInput<T>(name: string, value: T): void {
    this.fixture.componentRef.setInput(name, value);
  }

  private setSpies(): void {
    this.selectNextPhotoSpy = spyOn(
      this.dumbGallery,
      'selectNextPhoto'
    ).and.callThrough();
    this.selectPreviousPhotoSpy = spyOn(
      this.dumbGallery,
      'selectPreviousPhoto'
    ).and.callThrough();
    this.selectPhotoSpy = spyOn(
      this.component,
      'selectPhoto'
    ).and.callThrough();
    this.hasMorePhotosToLoadSpy = spyOn(
      this.dumbGallery,
      'hasMorePhotosToLoad'
    ).and.callThrough();
    this.swipeToItemSpy = spyOn(
      this.component as any,
      'swipeToItem'
    ).and.callThrough();
  }

  private setSubs(): void {
    this.subToAddItems();
    this.subToHasInitPhotos();
  }

  private subToAddItems(): void {
    this.component.addItems$.subscribe((items) => {
      this.addItemsEmittedValues.push(items);
    });
  }

  private subToHasInitPhotos(): void {
    TestBed.runInInjectionContext(() => {
      effect(this.onHasInitPhotos);
    });
  }

  private onHasInitPhotos = () => {
    const hasInitPhotos = this.component.hasInitPhotos();
    this.hasInit.next(hasInitPhotos);
  };

  expectComponentToBeCreated(): void {
    expect(this.component).toBeTruthy();
  }

  getLoadingPlaceHolder(): DebugElement {
    return this.getElementByClass('photo-selection__loading');
  }

  getNoPhotosPlaceHolder(): DebugElement {
    return this.getElementByClass('photo-selection__no-photo');
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

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  async whenStable(): Promise<void> {
    await this.fixture.whenStable();
  }

  getSelectPhotoSpy() {
    return this.selectPhotoSpy;
  }

  getSelectNextPhotoSpy() {
    return this.selectNextPhotoSpy;
  }

  getSelectPreviousSpy() {
    return this.selectPreviousPhotoSpy;
  }

  setSelectNextInput(): void {
    this.setInput('selectNextPhoto$', this.selectNext$.asObservable());
  }

  emitSelectNext(): void {
    this.selectNext$.next();
  }

  setSelectPreviousInput(): void {
    this.setInput('selectPreviousPhoto$', this.selectPrevious$.asObservable());
  }

  emitSelectPrevious(): void {
    this.selectPrevious$.next();
  }

  getSwipeToItemSpy() {
    return this.swipeToItemSpy;
  }

  getLoadPhotosFromServerSpy() {
    return this.fakePhotoApiService.searchPhoto;
  }

  selectPhoto(id: IPhoto['_id']): void {
    this.component.selectPhoto(id);
  }

  async simulatePhotosLoading(
    searchResult: ISearchResult<IPhoto> | Error
  ): Promise<void> {
    this.photosToLoad$.next(searchResult);
    await this.dumbGallery.loadMore();
    this.detectChanges();
  }

  getHasMorePhotosToLoadSpy() {
    return this.hasMorePhotosToLoadSpy;
  }

  expectEmittedAddItemsToBe(expectedValue: IPhoto[]): void {
    expect(expectedValue).toEqual(
      this.addItemsEmittedValues[this.addItemsEmittedValues.length - 1]
    );
  }

  clickOnSlide(slideIndex: number): void {
    const slideElt = this.getSlideElement(slideIndex);
    (slideElt.nativeElement as HTMLElement).click();
  }

  private getSlideElement(slideIndex: number): DebugElement {
    const swiperElement = this.getSwiperElement();
    return swiperElement.children[slideIndex].children[0];
  }

  getRequiredSlidesNb(): number {
    return this.component.nbSlides;
  }

  expectPhotosLoadToHaveBeenCalledWith(
    expectedOptions: ISearchPhotoOptions
  ): void {
    const loadPhotosSpy = this.getLoadPhotosFromServerSpy();
    expect(loadPhotosSpy).toHaveBeenCalled();
    const options: ISearchPhotoOptions | undefined =
      loadPhotosSpy.calls.mostRecent().args[0]?.options;
    const expectedSize = expectedOptions?.rendering?.size;
    if (expectedSize) {
      const size = options?.rendering?.size;
      expect(size).toBe(expectedSize);
    }
    const expectedFrom = expectedOptions?.rendering?.from;
    if (expectedFrom) {
      const from = options?.rendering?.from;
      expect(from).toBe(expectedFrom);
    }
  }
}
