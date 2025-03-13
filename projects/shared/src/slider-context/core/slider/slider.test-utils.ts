import { ISlider } from '../models';

export class SliderTestUtils<T> {
  constructor(private readonly slider: ISlider<T>) {}

  getActiveItemIndex(): number | undefined {
    return this.slider.activeItemIndex$.getValue();
  }

  getItemsSliceEndingWithItem(
    items: T[],
    nbItemsWanted: number,
    endingItemIndex: number
  ): T[] {
    // the ending item already counts for 1 added item
    const nbRemainingItemsToAdd = nbItemsWanted - 1;
    const firstItemIndex = endingItemIndex - nbRemainingItemsToAdd;
    const expectedItems = items.slice(
      firstItemIndex,
      endingItemIndex + 1 // need to `+1` because `slice.end` param is exclusive
    );
    return expectedItems;
  }

  expectNbOfSlidesToBe(expectedNbSlides: number): void {
    const slides = this.slider.slides$.getValue();
    expect(slides.length).toEqual(expectedNbSlides);
  }

  expectSlideValuesToMatch(expectedSlideValues: T[]): void {
    const slides = this.slider.slides$.getValue();
    expect(slides.length).toEqual(expectedSlideValues.length);
    expectedSlideValues.forEach((expectedValue) => {
      const isInSlides = slides.some((s) => s.value === expectedValue);
      expect(isInSlides).toBeTrue();
    });
  }

  expectActiveItemIndexToEqual(
    expectedActiveItemIndex: number | undefined
  ): void {
    const activeIndexItem = this.getActiveItemIndex();
    expect(expectedActiveItemIndex).toBeDefined();
    expect(activeIndexItem).toBeDefined();
    expect(activeIndexItem).toBe(expectedActiveItemIndex);
  }

  expectMatchingItemArrays(itemsA: T[], itemsB: T[]): void {
    expect(itemsA.length).toEqual(itemsB.length);

    itemsB.forEach((bItem) => {
      const isInItemA = itemsA.some((aItem) => aItem === bItem);
      expect(isInItemA).toBeTrue();
    });
  }
}
