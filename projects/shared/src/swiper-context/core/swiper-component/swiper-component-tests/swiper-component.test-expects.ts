import { Type } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';
import { ISwiperInitOptions } from '../../../core';
import { TestItem } from './models';
import { SwiperWrapperComponent } from './swiper-wrapper.component';
import { SwiperWrapperComponentTestUtils } from './swiper-wrapper.component.test-utils';
import { equals } from 'ramda';

export class SwiperComponentTestExpects extends SwiperWrapperComponentTestUtils {
  constructor(
    comp: Type<SwiperWrapperComponent>,
    config: TestModuleMetadata,
    inputs: {
      nbSlides: number;
      items: TestItem[];
      swiperInitOptions?: ISwiperInitOptions;
    }
  ) {
    super(comp, config, inputs);
  }

  expectSwiperComponentToBeCreated(): void {
    expect(this.getSwiperComponent()).toBeTruthy();
    expect(this.getSwiperComponentElement()).toBeTruthy();
  }

  expectSlidesNbToBe(expectedSlidesNb: number): void {
    const slideElements = this.getSwiperComponentElement();
    expect(slideElements.children.length).toBe(expectedSlidesNb);
  }

  expectSlidesContentsToBe(expectedContents: string[]): void {
    const slidesElements = this.getSlideElements();
    expect(expectedContents.length).toEqual(slidesElements.length);
    slidesElements.forEach((slide) => {
      const slideContent = this.extractSlideContent(slide);
      const isExpected = expectedContents.some((expectedContent) =>
        equals(expectedContent, slideContent)
      );
      expect(isExpected).toBeTrue();
    });
  }

  expectSlideValuesToMatch(items: TestItem[]): void {
    const expectedSlides = this.getSlides();
    expect(items.length).toEqual(expectedSlides.length);
    items.forEach((item) => {
      const isExpected = expectedSlides.some((slide) =>
        equals(slide.value, item)
      );
      expect(isExpected).toBeTrue();
    });
  }

  expectItemsToMatch(expectedItems: TestItem[]): void {
    const items = this.getItems();
    expect(items.length).toEqual(expectedItems.length);
    expect(items).toEqual(expectedItems);
  }

  expectItemToBeActivated(expectedActiveItemIndex: number): void {
    const activeItemIndex = this.getActiveItemIndex();
    expect(activeItemIndex).toEqual(expectedActiveItemIndex);
  }

  expectSwiperStateToMatchInitOptions(
    swiperInitOptions: ISwiperInitOptions
  ): void {
    const state = this.getSwiperState();
    if (swiperInitOptions.activeItemIndex) {
      this.expectActiveItemIndexToBe(state.activeItemIndex);
    }
    if (swiperInitOptions.slidesStartAt) {
      this.expectSlidesToMatchStartingItem(state.slides[0].itemIndex);
    }
  }

  private expectSlidesToMatchStartingItem(startingItemIndex: number): void {
    const nbItems = this.getItems().length;
    const shouldStartWithItem =
      startingItemIndex < nbItems - this.inputs.nbSlides;
    if (shouldStartWithItem) {
      this.expectFirstSlideItemIndexToBe(startingItemIndex);
      return;
    }
    expect(this.isItemInSlides(startingItemIndex)).toBeTrue();
  }

  expectActiveItemIndexToBe(expectedItemIndex: number | undefined): void {
    const activeItemIndex = this.getActiveItemIndex();
    expect(activeItemIndex).toBe(expectedItemIndex);
  }

  expectFirstSlideItemIndexToBe(expectedItemIndex: number): void {
    const firstSlide = this.getSlides()[0];
    if (!firstSlide) {
      return;
    }
    expect(firstSlide.itemIndex).toBe(expectedItemIndex);
  }
}
