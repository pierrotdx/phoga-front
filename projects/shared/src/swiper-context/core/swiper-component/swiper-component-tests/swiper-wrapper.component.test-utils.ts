import { CompTestUtils } from '../../../../test-utils-context';
import { DebugElement, Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom, Observable, Subject, Subscription } from 'rxjs';
import {
  IAutoSwipeOptions,
  ISlide,
  ISwiperInitOptions,
  ISwiperState,
} from '../../models';
import { SwiperWrapperComponent } from './swiper-wrapper.component';
import { GetSlideContentFromItem, TestItem } from './models';
import { clone } from 'ramda';

export class SwiperWrapperComponentTestUtils extends CompTestUtils<SwiperWrapperComponent> {
  readonly getSlideContentFromItem: GetSlideContentFromItem<TestItem> = (
    item: TestItem
  ) => {
    return item._id;
  };
  readonly slideClass = 'slide';

  private readonly swipeToNext$ = new Subject<void>();
  private readonly swipeToPrevious$ = new Subject<void>();
  private readonly autoSwipeStart$ = new Subject<
    IAutoSwipeOptions | undefined
  >();

  private readonly autoSwipeStop$ = new Subject<void>();

  private readonly swipeToItem$ = new Subject<number>();
  private readonly activateItem$ = new Subject<number | undefined>();
  private readonly addItems$ = new Subject<TestItem[]>();

  private swiperState!: ISwiperState<TestItem>;
  private swiperStateSub!: Subscription;

  private onItemsChangeSpy!: jasmine.Spy<
    typeof SwiperWrapperComponent.prototype.onItemsChange
  >;

  constructor(
    comp: Type<SwiperWrapperComponent>,
    config: TestModuleMetadata,
    protected readonly inputs: {
      nbSlides: number;
      items: TestItem[];
      swiperInitOptions?: ISwiperInitOptions;
    }
  ) {
    super(comp, config);
  }

  async globalBeforeEach(): Promise<void> {
    await this.internalBeforeEach();
    this.setOnItemsChangeSpy();
    this.setInputs();
    this.subscribeToSwiperState();
    await this.initSwiperState();
  }

  private setInputs(): void {
    this.setInput('nbSlides', this.inputs.nbSlides);
    this.setInput('items', this.inputs.items);
    this.setInput('swipeToNext$', this.swipeToNext$.asObservable());
    this.setInput('swipeToPrevious$', this.swipeToPrevious$.asObservable());
    this.setInput('autoSwipeStart$', this.autoSwipeStart$.asObservable());
    this.setInput('autoSwipeStop$', this.autoSwipeStop$.asObservable());
    this.setInput('swipeToItem$', this.swipeToItem$.asObservable());
    this.setInput('activateItem$', this.activateItem$.asObservable());
    this.setInput('addItems$', this.addItems$.asObservable());
    this.setInput('getSlideContent', this.getSlideContentFromItem);
    this.setInput('slideClass', this.slideClass);
    const swiperInitOptions = this.inputs.swiperInitOptions;
    if (this.inputs.swiperInitOptions) {
      this.setInput('swiperInitOptions', swiperInitOptions);
    }
  }

  private subscribeToSwiperState(): void {
    const swiperStateChange$ = this.getSwiperStateChange();
    this.swiperStateSub = swiperStateChange$.subscribe((swiperState) => {
      this.swiperState = swiperState;
    });
  }

  private getSwiperStateChange(): Observable<ISwiperState<TestItem>> {
    const swiperStateChange$ = this.getSwiperComponent()['swiper'].stateChange$;
    return swiperStateChange$;
  }

  private async initSwiperState(): Promise<void> {
    const swiperStateChange$ = this.getSwiperStateChange();
    this.swiperState = await firstValueFrom(swiperStateChange$);
  }

  globalAfterEach(): void {
    this.swiperStateSub.unsubscribe();
  }

  swipeToNext(): void {
    this.swipeToNext$.next();
  }

  swipeToPrevious(): void {
    this.swipeToPrevious$.next();
  }

  autoSwipeStart(options?: IAutoSwipeOptions): void {
    this.autoSwipeStart$.next(options);
  }

  autoSwipeStop(): void {
    this.autoSwipeStop$.next();
  }

  addItems(itemsToAdd: TestItem[]): void {
    this.addItems$.next(itemsToAdd);
  }

  getOnActivateItemSpy() {
    return spyOn(this.component as any, 'onActivateItem');
  }

  getSwiperComponent() {
    return this.fixture.componentInstance.swiperComponent;
  }

  protected getSwiperComponentElement() {
    return this.fixture.debugElement.query(By.css('lib-swiper'));
  }

  protected getSlideElements(): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css('.' + this.slideClass));
  }

  protected extractSlideContent(slideElement: DebugElement): string {
    return slideElement.childNodes[0].nativeNode.nodeValue;
  }

  getSlides(): ISlide<TestItem>[] {
    return this.getSwiperState().slides;
  }

  getSwiperState(): ISwiperState<TestItem> {
    return clone(this.swiperState);
  }

  protected getActiveItemIndex(): number | undefined {
    return this.getSwiperState().activeItemIndex;
  }

  getItems(): TestItem[] {
    const swiper = this.getSwiperComponent()['swiper'];
    return swiper.getItems();
  }

  getSlideFromItem(item: TestItem, itemIndex: number): ISlide<TestItem> {
    const activeItemIndex = this.getActiveItemIndex();
    return { itemIndex, value: item, isActive: itemIndex === activeItemIndex };
  }

  activateItem(index: number | undefined): void {
    this.activateItem$.next(index);
  }

  getSwiperStateChangeSpy() {
    const swiperStateChange = this.getSwiperComponent().swiperStateChange;
    return spyOn(swiperStateChange, 'emit');
  }

  private setOnItemsChangeSpy() {
    this.onItemsChangeSpy = spyOn(this.component, 'onItemsChange');
  }

  getOnItemsChangeSpy() {
    return this.onItemsChangeSpy;
  }

  startSlidesFromItem(startIndex: number) {
    let index = 0;
    const swiperComponent = this.getSwiperComponent();
    while (index < startIndex) {
      swiperComponent['swiper'].swipeToNext();
      index++;
    }
  }

  swipeToItem(itemIndex: number): void {
    this.swipeToItem$.next(itemIndex);
  }

  isItemInSlides(itemIndex: number): boolean {
    const slides = this.getSlides();
    return slides.some((slide) => slide.itemIndex === itemIndex);
  }

  getAutoSwipeStartSpy() {
    const swiperComp = this.getSwiperComponent();
    return spyOn(swiperComp['swiper'], 'autoSwipeStart');
  }

  getAutoSwipeStopSpy() {
    const swiperComp = this.getSwiperComponent();
    return spyOn(swiperComp['swiper'], 'autoSwipeStop');
  }
}
