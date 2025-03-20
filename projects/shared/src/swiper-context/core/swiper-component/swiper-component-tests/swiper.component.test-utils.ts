import { CompTestUtils } from '@shared/comp.test-utils';
import { DebugElement, Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { firstValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { ISlide, ISwiperInitOptions, ISwiperState } from '../../models';
import { SwiperWrapperComponent } from './swiper-wrapper.component';
import { GetSlideContentFromItem, TestItem } from './models';
import { clone } from 'ramda';

export class SwiperComponentTestUtils extends CompTestUtils<SwiperWrapperComponent> {
  readonly getSlideContentFromItem: GetSlideContentFromItem<TestItem> = (
    item: TestItem
  ) => {
    return item._id;
  };
  readonly slideClass = 'slide';

  private readonly swipeToNext$ = new Subject<void>();
  private readonly swipeToPrevious$ = new Subject<void>();
  private readonly activateItem$ = new Subject<number | undefined>();
  private readonly addItems$ = new Subject<TestItem[]>();

  private swiperState!: ISwiperState<TestItem>;
  private swiperStateSub!: Subscription;

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
    this.setInputs();
    this.subscribeToSwiperState();
    await this.initSwiperState();
  }

  private setInputs(): void {
    this.setInput('nbSlides', this.inputs.nbSlides);
    this.setInput('items', this.inputs.items);
    this.setInput('swipeToNext$', this.swipeToNext$.asObservable());
    this.setInput('swipeToPrevious$', this.swipeToPrevious$.asObservable());
    this.setInput('activateItem$', this.activateItem$.asObservable());
    this.setInput('addItems$', this.addItems$.asObservable());
    this.setInput('getSlideContent', this.getSlideContentFromItem);
    this.setInput('slideClass', this.slideClass);
    const swiperInitOptions = this.inputs.swiperInitOptions;
    if (this.inputs.swiperInitOptions) {
      console.log('setting swiper init options', swiperInitOptions);
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

  addItems(itemsToAdd: TestItem[]): void {
    this.addItems$.next(itemsToAdd);
  }

  getOnActivateItemSpy() {
    return spyOn(this.component as any, 'onActivateItem');
  }

  getSwiperComponent() {
    return this.fixture.componentInstance.swiperComponent!;
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

  protected getItems(): TestItem[] {
    const swiper = this.getSwiperComponent()['swiper'];
    return swiper.getItems();
  }

  getSlideFromItem(item: TestItem, itemIndex: number): ISlide<TestItem> {
    return { itemIndex, value: item };
  }

  activateItem(index: number | undefined): void {
    this.activateItem$.next(index);
  }

  getSwiperStateChangeSpy() {
    const swiperStateChange = this.getSwiperComponent().swiperStateChange;
    return spyOn(swiperStateChange, 'emit');
  }

  startSlidesFromItem(startIndex: number) {
    let index = 0;
    const swiperComponent = this.getSwiperComponent();
    while (index < startIndex) {
      swiperComponent['swiper'].swipeToNext();
      index++;
    }
  }
}
