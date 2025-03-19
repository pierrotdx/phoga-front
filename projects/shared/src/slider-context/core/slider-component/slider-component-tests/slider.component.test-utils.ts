import { CompTestUtils } from '@shared/comp.test-utils';
import { DebugElement, ElementRef, Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { SliderComponent } from '../slider.component';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { ISlide } from '../../models';
import { SliderWrapperComponent } from './slider-wrapper.component';
import { GetSlideContentFromItem, TestItem } from './models';

export class SliderComponentTestUtils extends CompTestUtils<SliderWrapperComponent> {
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

  private sliderCompInstance!: SliderComponent<TestItem>;
  private sliderCompElement!: ElementRef<unknown>;

  constructor(
    comp: Type<SliderWrapperComponent>,
    config: TestModuleMetadata,
    private readonly inputs: {
      nbSlides: number;
      items: TestItem[];
    }
  ) {
    super(comp, config);
  }

  async globalBeforeEach(): Promise<void> {
    await this.internalBeforeEach();
    this.setInputs();
    this.sliderCompInstance = this.getSliderComponent();
    this.sliderCompElement = this.getSliderComponentElement();
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

  getSliderComponent() {
    return this.fixture.componentInstance.sliderComponent!;
  }

  expectSliderComponentToBeCreated(): void {
    expect(this.sliderCompInstance).toBeTruthy();
    expect(this.sliderCompElement).toBeTruthy();
  }

  expectSlidesNbToBe(expectedSlidesNb: number): void {
    const slideElements = this.getSliderComponentElement();
    expect(slideElements.children.length).toBe(expectedSlidesNb);
  }

  private getSliderComponentElement() {
    return this.fixture.debugElement.query(By.css('lib-slider'));
  }

  expectSlidesContentsToBe(expectedContents: string[]): void {
    const slidesElements = this.getSlideElements();
    expect(expectedContents.length).toEqual(slidesElements.length);
    slidesElements.forEach((slide) => {
      const slideContent = this.extractSlideContent(slide);
      const isExpected = expectedContents.some(
        (expectedContent) => expectedContent === slideContent
      );
      expect(isExpected).toBeTrue();
    });
  }

  private getSlideElements(): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css('.' + this.slideClass));
  }

  private extractSlideContent(slideElement: DebugElement): string {
    return slideElement.childNodes[0].nativeNode.nodeValue;
  }

  expectSlideValuesToMatch(items: TestItem[]): void {
    const expectedSlides = this.getSlides();
    expect(items.length).toEqual(expectedSlides.length);
    items.forEach((item) => {
      const isExpected = expectedSlides.some((slide) => slide.value === item);
      expect(isExpected).toBeTrue();
    });
  }

  private getSlides(): ISlide<TestItem>[] {
    return this.sliderCompInstance.slides();
  }

  getActiveItemIndex(): number | undefined {
    return this.getSliderComponent()['slider'].activeItemIndex$.getValue();
  }

  private getItems(): TestItem[] {
    return this.getSliderComponent()['slider'].getItems();
  }

  expectItemsToMatch(expectedItems: TestItem[]): void {
    const items = this.getItems();
    expect(items.length).toEqual(expectedItems.length);
    expect(items).toEqual(expectedItems);
  }

  getSlideFromItem(item: TestItem, itemIndex: number): ISlide<TestItem> {
    return { itemIndex, value: item };
  }

  expectItemToBeActivated(expectedActiveItemIndex: number): void {
    const activeItemIndex = this.getActiveItemIndex();
    expect(activeItemIndex).toEqual(expectedActiveItemIndex);
  }

  activateItem(index: number | undefined): void {
    this.activateItem$.next(index);
  }

  getSlidesChangeSpy() {
    const sliderComponent = this.getSliderComponent();
    return spyOn(sliderComponent.slidesChange, 'emit');
  }

  getActiveItemIndexChangeSpy() {
    const sliderComponent = this.getSliderComponent();
    return spyOn(sliderComponent.activeItemIndexChange, 'emit');
  }

  expectActiveItemIndexToBeEmitted(
    expectedEmittedIndex: number,
    eventEmitterSpy: jasmine.Spy
  ): void {
    expect(eventEmitterSpy).toHaveBeenCalledOnceWith(expectedEmittedIndex);
  }
}
