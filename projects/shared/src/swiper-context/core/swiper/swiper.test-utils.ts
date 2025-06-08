import { Subscription } from 'rxjs';
import { ISwiper, ISwiperState } from '../models';

export class SwiperTestUtils<T> {
  private swiperState!: ISwiperState<T>;
  private readonly swiperStateSub: Subscription;

  constructor(private readonly swiper: ISwiper<T>) {
    this.swiperStateSub = this.swiper.stateChange$.subscribe((swiperState) => {
      this.swiperState = swiperState;
    });
  }

  unsubscribeSwiperState(): void {
    this.swiperStateSub.unsubscribe();
  }

  getActiveItemIndex(): number | undefined {
    return this.swiperState?.activeItemIndex;
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
    const slides = this.swiperState?.slides;
    expect(slides.length).toEqual(expectedNbSlides);
  }

  expectSlideValuesToEqual(expectedSlideValues: T[]): void {
    const slides = this.swiperState.slides;
    const slideValues = slides.map((s) => s.value);
    expect(slideValues).toEqual(expectedSlideValues);
  }

  expectActiveItemIndexToEqual(
    expectedActiveItemIndex: number | undefined
  ): void {
    const activeIndexItem = this.getActiveItemIndex();
    expect(activeIndexItem).toBe(expectedActiveItemIndex);
  }

  expectMatchingItemArrays(itemsA: T[], itemsB: T[]): void {
    expect(itemsA.length).toEqual(itemsB.length);

    itemsB.forEach((bItem) => {
      const isInItemA = itemsA.some((aItem) => aItem === bItem);
      expect(isInItemA).toBeTrue();
    });
  }

  getSwiperState(): ISwiperState<T> {
    return this.swiperState;
  }

  startSlidesFromItem(startIndex: number) {
    let index = 0;
    while (index < startIndex) {
      this.swiper.swipeToNext();
      index++;
    }
  }

  getSwipeToNextSpy() {
    return spyOn(this.swiper, 'swipeToNext');
  }

  waitForTime(timeInMs: number) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs));
  }
}
