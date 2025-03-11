import { ISlide } from '../models';
import { Slider } from './slider';

type TItem = string;

describe('slider', () => {
  let slider: Slider<TItem>;
  let items: TItem[];
  let nbSlides: number;

  describe('the slider size', () => {
    items = ['a', 'b', 'c'];

    describe('when the nb of slides is less than the nb of items', () => {
      beforeEach(() => {
        nbSlides = 2;
        slider = new Slider({ items, nbSlides });
      });
      it('should be the nb of slides', () => {
        const slides = slider.slides$.getValue();
        expect(slides.length).toEqual(nbSlides);
      });
    });

    describe('when the nb of slides is greater than the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length + 1;
        slider = new Slider({ items, nbSlides });
      });
      it('should be the nb of items', () => {
        const slides = slider.slides$.getValue();
        expect(slides.length).toEqual(items.length);
      });
    });

    describe('when the nb of slides equals the nb of items', () => {
      beforeEach(() => {
        nbSlides = items.length;
        slider = new Slider({ items, nbSlides });
      });
      it('should be the nb of items', () => {
        const slides = slider.slides$.getValue();
        expect(slides.length).toEqual(nbSlides);
        expect(slides.length).toEqual(items.length);
      });
    });
  });

  describe('the slides', () => {
    it('should initially be filled with the first items', () => {
      items = ['item 1', 'item 2', 'item 3'];
      nbSlides = 2;
      slider = new Slider({ items, nbSlides });
      const slides = slider.slides$.getValue();
      slides.forEach((slide, index) => {
        const item = items[index];
        expect(slide.value).toEqual(item);
        expect(slide.itemIndex).toEqual(index);
      });
    });
  });

  describe('the `next()` function', () => {
    let initSlides: ISlide<TItem>[];

    it('should not modify the active item', () => {
      items = ['a', 'b', 'c'];
      nbSlides = 2;
      slider = new Slider({ items, nbSlides });
      const activeSlideIndexBefore = getActiveItemIndex(slider);
      slider.next();
      const activeSlideIndexAfter = getActiveItemIndex(slider);
      expect(activeSlideIndexBefore).toBeDefined();
      expect(activeSlideIndexAfter).toBeDefined();
      expect(activeSlideIndexAfter).toBe(activeSlideIndexBefore);
    });

    describe('when there are more items to show on the right side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 2;
        slider = new Slider({ items, nbSlides });
      });

      it('should shift the slides to the right', () => {
        const expectedInitSlideValues = [...items].splice(0, nbSlides);
        initSlides = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(initSlides, expectedInitSlideValues);

        slider.next();

        const expectedSlidesAfter = [...items].splice(1, nbSlides);
        const slidesAfter = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(slidesAfter, expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the right side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 3;
        slider = new Slider({ items, nbSlides });
      });

      it('should do nothing to the slides', () => {
        const expectedInitSlides = [...items].splice(0, nbSlides);
        initSlides = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(initSlides, expectedInitSlides);

        slider.next();

        const slidesAfter = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(slidesAfter, expectedInitSlides);
      });
    });
  });

  describe('the `previous()` function', () => {
    let initSlides: ISlide<TItem>[];

    it('should not modify the active item', () => {
      items = ['a', 'b', 'c'];
      nbSlides = 2;
      slider = new Slider({ items, nbSlides });
      const activeSlideIndex = 1;
      slider.activateItem(activeSlideIndex);

      const activeSlideIndexBefore = getActiveItemIndex(slider);
      slider.previous();
      const activeSlideIndexAfter = getActiveItemIndex(slider);
      expect(activeSlideIndexBefore).toBeDefined();
      expect(activeSlideIndexAfter).toBeDefined();
      expect(activeSlideIndexAfter).toBe(activeSlideIndexBefore);
      expect(activeSlideIndexAfter).toBe(activeSlideIndex);
    });

    describe('when there are more items to show on the left side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 2;
        slider = new Slider({ items, nbSlides });
        slider.next();
      });

      it('should shift the slides to the left', () => {
        const expectedInitSlides = [...items].splice(1, nbSlides);
        initSlides = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(initSlides, expectedInitSlides);

        slider.previous();

        const expectedSlidesAfter = [...items].splice(0, nbSlides);
        const slidesAfter = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(slidesAfter, expectedSlidesAfter);
      });
    });

    describe('when there are no more items to show on the left side', () => {
      beforeEach(() => {
        items = ['a', 'b', 'c'];
        nbSlides = 3;
        slider = new Slider({ items, nbSlides });
      });

      it('should do nothing to the slides', () => {
        const expectedInitSlides = [...items].splice(0, nbSlides);
        initSlides = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(initSlides, expectedInitSlides);

        slider.previous();

        const slidesAfter = slider.slides$.getValue();
        expectSlidesValuesToMatchArray(slidesAfter, expectedInitSlides);
      });
    });
  });

  describe('the `navToItem()` function', () => {
    beforeEach(() => {
      items = ['t', 'u', 'v', 'w', 'x'];
      nbSlides = 2;
      slider = new Slider({ items, nbSlides });
    });

    describe('when the input item is not in the slides', () => {
      let slidesBefore: ISlide<TItem>[];
      let expectedSlidesBefore: TItem[];
      let activatedSlideIndexBefore: number | undefined;

      beforeEach(() => {
        slider = new Slider({ items, nbSlides });
        slider.next();
        expectedSlidesBefore = items.slice(1, nbSlides + 1);
        slidesBefore = slider.slides$.getValue();
        activatedSlideIndexBefore = getActiveItemIndex(slider);
      });

      describe('when it is before the slides', () => {
        const inputIndex = 0;

        beforeEach(() => {
          slider.navToItem(inputIndex);
        });

        it('should update the slides such that the first one matches the input item', () => {
          expectSlidesValuesToMatchArray(slidesBefore, expectedSlidesBefore);
          const expectedSlidesAfter = items.slice(inputIndex, nbSlides);
          const slidesAfter = slider.slides$.getValue();
          expectSlidesValuesToMatchArray(slidesAfter, expectedSlidesAfter);
        });
      });

      describe('when it is after the slides', () => {
        const inputIndex = 3;

        beforeEach(() => {
          slider.navToItem(inputIndex);
        });

        it('should update the slides such that the last one matches the input', () => {
          expectSlidesValuesToMatchArray(slidesBefore, expectedSlidesBefore);
          const expectedSlidesAfter = items.slice(inputIndex, nbSlides);
          const slidesAfter = slider.slides$.getValue();
          expectSlidesValuesToMatchArray(slidesAfter, expectedSlidesAfter);
        });
      });
    });
  });

  describe('the `activateItem()` function', () => {
    let activeSlideIndexBefore: number | undefined;

    beforeEach(() => {
      items = ['k', 'r', 'z', 'o'];
      nbSlides = 3;
      slider = new Slider({ items, nbSlides });
    });

    it('should activate the slide according to the input', () => {
      activeSlideIndexBefore = getActiveItemIndex(slider);
      const targetItemIndex = 2;
      slider.activateItem(targetItemIndex);
      const activeSlideIndexAfter = getActiveItemIndex(slider);
      expect(activeSlideIndexBefore).not.toBe(activeSlideIndexAfter);
      expect(activeSlideIndexAfter).toBe(targetItemIndex);
    });

    it('should not do anything if the input slide index is greater than the total number of items', () => {
      activeSlideIndexBefore = getActiveItemIndex(slider);
      const targetItemIndex = items.length + 1;
      slider.activateItem(targetItemIndex);
      const activeSlideIndexAfter = getActiveItemIndex(slider);
      expect(activeSlideIndexAfter).toBe(activeSlideIndexBefore);
    });

    it('should not do anything if the input slide index is lesser than 0', () => {
      activeSlideIndexBefore = getActiveItemIndex(slider);
      const targetedSelectedItemIndex = -1;
      slider.activateItem(targetedSelectedItemIndex);
      const activeSlideIndexAfter = getActiveItemIndex(slider);
      expect(activeSlideIndexAfter).toBe(activeSlideIndexBefore);
    });
  });

  describe('the `addItems()` function', () => {
    beforeEach(() => {
      items = ['a', 'z'];
      nbSlides = 2;
      slider = new Slider({ items, nbSlides });
    });

    it('should add more items', () => {
      const itemsToAdd = ['c', 'e'];

      const itemsBefore = slider['items$'].getValue();
      expect(itemsBefore).toEqual(items);

      slider.addItems(itemsToAdd);

      const expectedItemsAfter = items.concat(itemsToAdd);
      const itemsAfter = slider['items$'].getValue();
      expect(itemsAfter).toEqual(expectedItemsAfter);
    });
  });
});

function getActiveItemIndex(slider: Slider<TItem>): number | undefined {
  return slider.activeItemIndex$.getValue();
}

function expectSlidesValuesToMatchArray<T>(
  slides: ISlide<T>[],
  expectedValues: T[]
): void {
  slides.forEach((slide, index) => {
    const expectedValue = expectedValues[index];
    expect(slide.value).toEqual(expectedValue);
  });
}
