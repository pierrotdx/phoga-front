import { Swiper } from './swiper';
import { SwiperTestUtils } from './swiper.test-utils';

type TItem = string;

describe('swiper', () => {
  let swiper: Swiper<TItem>;
  let testUtils: SwiperTestUtils<TItem>;
  let items: TItem[];
  let nbSlides: number;

  beforeEach(() => {
    items = ['a', 'b', 'c', 'd', 'e'];
    nbSlides = 3;
    swiper = new Swiper({ items, nbSlides });
    testUtils = new SwiperTestUtils<TItem>(swiper);
  });

  afterEach(() => {
    testUtils.unsubscribeSwiperState();
  });

  describe('the swiper size', () => {
    describe('when the nb of slides is less than the nb of items', () => {
      it('should be the nb of slides', () => {
        testUtils.expectNbOfSlidesToBe(nbSlides);
      });
    });

    describe('when the nb of slides is greater than the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length + 1;
        swiper = new Swiper({ items, nbSlides });
        testUtils = new SwiperTestUtils<TItem>(swiper);
      });
      it('should be the nb of items', () => {
        testUtils.expectNbOfSlidesToBe(items.length);
      });
    });

    describe('when the nb of slides equals the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length;
        swiper = new Swiper({ items, nbSlides });
        testUtils = new SwiperTestUtils<TItem>(swiper);
      });

      it('should be the nb of items', () => {
        testUtils.expectNbOfSlidesToBe(items.length);
        testUtils.expectNbOfSlidesToBe(nbSlides);
      });
    });
  });

  describe('the slides', () => {
    it('should initially be filled with the first items', () => {
      const expectedSlideValues = items.slice(0, nbSlides);
      testUtils.expectSlideValuesToMatch(expectedSlideValues);
    });
  });

  describe('swipeToNext()', () => {
    it('should not modify the active item', () => {
      const initActiveItemIndex = 2;
      swiper.activateItem(initActiveItemIndex);

      swiper.swipeToNext();

      testUtils.expectActiveItemIndexToEqual(initActiveItemIndex);
    });

    describe('when there are more items to show on the right side', () => {
      it('should shift the slides to the right', () => {
        const expectedInitSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);

        swiper.swipeToNext();

        const expectedSlidesAfter = items.slice(1, nbSlides + 1);
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the right side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 3;
        swiper = new Swiper({ items, nbSlides });
        testUtils = new SwiperTestUtils<TItem>(swiper);
      });

      it('should do nothing to the slides', () => {
        const expectedSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedSlides);

        swiper.swipeToNext();

        testUtils.expectSlideValuesToMatch(expectedSlides);
      });
    });
  });

  describe('swipeToPrevious()', () => {
    it('should not modify the active item', () => {
      const activeSlideIndex = 1;
      swiper.activateItem(activeSlideIndex);
      testUtils.expectActiveItemIndexToEqual(activeSlideIndex);

      swiper.swipeToPrevious();

      testUtils.expectActiveItemIndexToEqual(activeSlideIndex);
    });

    describe('when there are more items to show on the left side', () => {
      beforeEach(() => {
        testUtils.startSlidesFromItem(1);
      });

      it('should shift the slides to the left', () => {
        const expectedInitSlides = items.slice(1, nbSlides + 1);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);

        swiper.swipeToPrevious();

        const expectedSlidesAfter = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the left side', () => {
      it('should do nothing to the slides', () => {
        const expectedInitSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);

        swiper.swipeToPrevious();

        testUtils.expectSlideValuesToMatch(expectedInitSlides);
      });
    });
  });

  describe('swipeToItem()', () => {
    let expectedSlidesBefore: TItem[];
    let inputIndex: number;

    describe('when the input item is before the slides', () => {
      beforeEach(() => {
        testUtils.startSlidesFromItem(1);
        inputIndex = 0;
        expectedSlidesBefore = items.slice(inputIndex + 1, nbSlides + 1);
      });

      it('should update the slides such that the first one matches the input item', () => {
        testUtils.expectSlideValuesToMatch(expectedSlidesBefore);

        swiper.swipeToItem(inputIndex);

        const expectedSlidesAfter = items.slice(inputIndex, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });

    describe('when the input item is after the slides', () => {
      beforeEach(() => {
        inputIndex = items.length - 1;
        expectedSlidesBefore = items.slice(0, nbSlides);
      });

      it('should update the slides such that the last one matches the input', () => {
        testUtils.expectSlideValuesToMatch(expectedSlidesBefore);

        swiper.swipeToItem(inputIndex);

        const swiperItems = swiper.getItems();
        const expectedSlidesAfter = testUtils.getItemsSliceEndingWithItem(
          swiperItems,
          nbSlides,
          inputIndex
        );
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });
  });

  describe('activateItem()', () => {
    let activeSlideIndexBefore: number | undefined;

    beforeEach(() => {
      activeSlideIndexBefore = testUtils.getActiveItemIndex();
    });

    it('should activate the slide according to the input', () => {
      const targetItemIndex = 2;

      swiper.activateItem(targetItemIndex);

      testUtils.expectActiveItemIndexToEqual(targetItemIndex);
    });

    it('should not do anything if the input slide index is greater than the total number of items', () => {
      const targetItemIndex = items.length + 1;

      swiper.activateItem(targetItemIndex);

      testUtils.expectActiveItemIndexToEqual(activeSlideIndexBefore);
    });

    it('should not do anything if the input slide index is lesser than 0', () => {
      const targetedSelectedItemIndex = -1;

      swiper.activateItem(targetedSelectedItemIndex);

      testUtils.expectActiveItemIndexToEqual(activeSlideIndexBefore);
    });
  });

  describe('addItems()', () => {
    it('should add more items', () => {
      const itemsToAdd = ['y', 'z'];
      const initItems = swiper.getItems();
      testUtils.expectMatchingItemArrays(initItems, items);

      swiper.addItems(itemsToAdd);

      const expectedItemsAfter = items.concat(itemsToAdd);
      const newItems = swiper.getItems();
      testUtils.expectMatchingItemArrays(newItems, expectedItemsAfter);
    });
  });

  describe('getItem()', () => {
    it("should return the swiper's items", () => {
      const swiperItems = swiper.getItems();
      testUtils.expectMatchingItemArrays(items, swiperItems);
    });

    it('should return an empty array if there are no items', () => {
      swiper = new Swiper({ items: undefined, nbSlides });
      testUtils = new SwiperTestUtils<TItem>(swiper);
      const expectedItems: TItem[] = [];

      const swiperItems = swiper.getItems();

      testUtils.expectMatchingItemArrays(expectedItems, swiperItems);
    });
  });

  describe("swiper's state", () => {
    it('should initially have no active item', () => {
      const swiperState = testUtils.getSwiperState();
      expect(swiperState.activeItemIndex).toBeUndefined();
    });

    it('should change when the active item changes', () => {
      const expectedActiveItemIndex = 2;

      swiper.activateItem(expectedActiveItemIndex);

      const swiperState = testUtils.getSwiperState();
      expect(swiperState.activeItemIndex).toBe(expectedActiveItemIndex);
    });

    it('should change when the slides change', () => {
      const swiperStateBefore = testUtils.getSwiperState();

      swiper.swipeToNext();

      const swiperStateAfter = testUtils.getSwiperState();
      expect(swiperStateAfter.slides).not.toEqual(swiperStateBefore.slides);
    });
  });
});
