import { Slider } from './slider';
import { SliderTestUtils } from './slider.test-utils';

type TItem = string;

describe('slider', () => {
  let slider: Slider<TItem>;
  let testUtils: SliderTestUtils<TItem>;
  let items: TItem[];
  let nbSlides: number;

  beforeEach(() => {
    items = ['a', 'b', 'c', 'd', 'e'];
    nbSlides = 3;
    slider = new Slider({ items, nbSlides });
    testUtils = new SliderTestUtils<TItem>(slider);
  });

  describe('the slider size', () => {
    describe('when the nb of slides is less than the nb of items', () => {
      it('should be the nb of slides', () => {
        testUtils.expectNbOfSlidesToBe(nbSlides);
      });
    });

    describe('when the nb of slides is greater than the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length + 1;
        slider = new Slider({ items, nbSlides });
        testUtils = new SliderTestUtils<TItem>(slider);
      });
      it('should be the nb of items', () => {
        testUtils.expectNbOfSlidesToBe(items.length);
      });
    });

    describe('when the nb of slides equals the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length;
        slider = new Slider({ items, nbSlides });
        testUtils = new SliderTestUtils<TItem>(slider);
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

  describe('the `swipeToNext()` function', () => {
    it('should not modify the active item', () => {
      const initActiveItemIndex = testUtils.getActiveItemIndex();
      slider.swipeToNext();
      testUtils.expectActiveItemIndexToEqual(initActiveItemIndex);
    });

    describe('when there are more items to show on the right side', () => {
      it('should shift the slides to the right', () => {
        const expectedInitSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
        slider.swipeToNext();
        const expectedSlidesAfter = items.slice(1, nbSlides + 1);
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the right side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 3;
        slider = new Slider({ items, nbSlides });
        testUtils = new SliderTestUtils<TItem>(slider);
      });

      it('should do nothing to the slides', () => {
        const expectedInitSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
        slider.swipeToNext();
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
      });
    });
  });

  describe('the `swipeToPrevious()` function', () => {
    it('should not modify the active item', () => {
      const activeSlideIndex = 1;
      slider.activateItem(activeSlideIndex);
      testUtils.expectActiveItemIndexToEqual(activeSlideIndex);
      slider.swipeToPrevious();
      testUtils.expectActiveItemIndexToEqual(activeSlideIndex);
    });

    describe('when there are more items to show on the left side', () => {
      beforeEach(() => {
        slider.swipeToNext();
      });

      it('should shift the slides to the left', () => {
        const expectedInitSlides = items.slice(1, nbSlides + 1);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
        slider.swipeToPrevious();
        const expectedSlidesAfter = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the left side', () => {
      it('should do nothing to the slides', () => {
        const expectedInitSlides = items.slice(0, nbSlides);
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
        slider.swipeToPrevious();
        testUtils.expectSlideValuesToMatch(expectedInitSlides);
      });
    });
  });

  describe('the `swipeToItem()` function', () => {
    let expectedSlidesBefore: TItem[];
    let inputIndex: number;

    describe('when the input item is before the slides', () => {
      beforeEach(() => {
        inputIndex = 0;
        slider.swipeToNext();
        expectedSlidesBefore = items.slice(inputIndex + 1, nbSlides + 1);
      });

      it('should update the slides such that the first one matches the input item', () => {
        testUtils.expectSlideValuesToMatch(expectedSlidesBefore);
        slider.swipeToItem(inputIndex);
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
        slider.swipeToItem(inputIndex);
        const items = getItems(slider);
        const expectedSlidesAfter = testUtils.getItemsSliceEndingWithItem(
          items,
          nbSlides,
          inputIndex
        );
        testUtils.expectSlideValuesToMatch(expectedSlidesAfter);
      });
    });
  });

  describe('the `activateItem()` function', () => {
    let activeSlideIndexBefore: number | undefined;

    beforeEach(() => {
      activeSlideIndexBefore = testUtils.getActiveItemIndex();
    });

    it('should activate the slide according to the input', () => {
      const targetItemIndex = 2;
      slider.activateItem(targetItemIndex);
      testUtils.expectActiveItemIndexToEqual(targetItemIndex);
    });

    it('should not do anything if the input slide index is greater than the total number of items', () => {
      const targetItemIndex = items.length + 1;
      slider.activateItem(targetItemIndex);
      testUtils.expectActiveItemIndexToEqual(activeSlideIndexBefore);
    });

    it('should not do anything if the input slide index is lesser than 0', () => {
      const targetedSelectedItemIndex = -1;
      slider.activateItem(targetedSelectedItemIndex);
      testUtils.expectActiveItemIndexToEqual(activeSlideIndexBefore);
    });
  });

  describe('the `addItems()` function', () => {
    it('should add more items', () => {
      const itemsToAdd = ['y', 'z'];
      const initItems = getItems(slider);
      testUtils.expectMatchingItemArrays(initItems, items);
      slider.addItems(itemsToAdd);

      const expectedItemsAfter = items.concat(itemsToAdd);
      const newItems = getItems(slider);

      testUtils.expectMatchingItemArrays(newItems, expectedItemsAfter);
    });
  });
});

function getItems(slider: Slider<TItem>): TItem[] {
  return slider['items$'].getValue();
}
