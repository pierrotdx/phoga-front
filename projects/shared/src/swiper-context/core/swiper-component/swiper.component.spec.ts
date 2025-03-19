import { ISlide } from '../models';
import { SwiperComponent } from './swiper.component';
import { SwiperWrapperComponent, TestItem } from './swiper-component-tests';
import { SwiperComponentTestUtils } from './swiper-component-tests/swiper.component.test-utils';

// Need to test the swiper component,
// which has an input being a template ref,
// via a wrapping component.
// https://stackoverflow.com/a/57019955/6281776
describe('SwiperComponent', () => {
  let testUtils: SwiperComponentTestUtils;
  let nbSlides: number;
  let items: TestItem[];

  beforeEach(async () => {
    nbSlides = 3;
    items = [
      { _id: 'slide-1' },
      { _id: 'slide-2' },
      { _id: 'slide-3' },
      { _id: 'slide-4' },
    ];
    testUtils = await restartTestUtils(testUtils, { nbSlides, items });
  });

  it('should create', () => {
    testUtils.expectSwiperComponentToBeCreated();
  });

  describe('the number of slides', () => {
    let expectedNbOfSlides: number;

    describe('when the number of items is greater than the required number of slides', () => {
      it('should equal the required number of slides', () => {
        expectedNbOfSlides = nbSlides;
        testUtils.expectSlidesNbToBe(expectedNbOfSlides);
      });
    });

    describe('when the number of items is lesser than the required number of slides', () => {
      let fewItems: TestItem[];

      beforeEach(async () => {
        fewItems = items.slice(0, nbSlides - 1);
        testUtils = await restartTestUtils(testUtils, {
          nbSlides,
          items: fewItems,
        });
      });

      it('should equal the number of items', () => {
        expectedNbOfSlides = fewItems.length;
        testUtils.expectSlidesNbToBe(expectedNbOfSlides);
      });
    });
  });

  describe('the slides content', () => {
    it('should match the content defined by the input slide template', () => {
      const displayedItems = items.slice(0, nbSlides);
      const expectedContents = displayedItems.map((item) =>
        testUtils.getSlideContentFromItem(item)
      );
      testUtils.expectSlidesContentsToBe(expectedContents);
    });
  });

  describe('swipeToNext', () => {
    it('should swipe to next when asked to', () => {
      const initExpectedSlides = items.slice(0, nbSlides);
      testUtils.expectSlideValuesToMatch(initExpectedSlides);

      testUtils.swipeToNext();

      const afterSwipeExpectedSlides = items.slice(1, nbSlides + 1);
      testUtils.expectSlideValuesToMatch(afterSwipeExpectedSlides);
    });
  });

  describe('swipeToPrevious', () => {
    beforeEach(() => {
      testUtils.swipeToNext();
    });

    it('should swipe to previous when asked to', () => {
      const initExpectedSlides = items.slice(1, nbSlides + 1);
      testUtils.expectSlideValuesToMatch(initExpectedSlides);

      testUtils.swipeToPrevious();

      const afterSwipeExpectedSlides = items.slice(0, nbSlides);
      testUtils.expectSlideValuesToMatch(afterSwipeExpectedSlides);
    });
  });

  describe('activateItem', () => {
    it('should be `undefined` by default', () => {
      const initActiveItemIndex = testUtils.getActiveItemIndex();
      expect(initActiveItemIndex).toBeUndefined();
    });

    const expectedActiveItemIndices = [3, 0, 1];
    expectedActiveItemIndices.forEach((itemIndex) => {
      it('should set the active item', () => {
        testUtils.activateItem(itemIndex);

        testUtils.expectItemToBeActivated(itemIndex);
      });
    });
  });

  describe('addItems', () => {
    it('should add the provided items', () => {
      const initItems = items;
      testUtils.expectItemsToMatch(initItems);
      const itemsToAdd: TestItem[] = [{ _id: 'test-99' }, { _id: 'test-100' }];

      testUtils.addItems(itemsToAdd);

      const newItems = items.concat(itemsToAdd);
      testUtils.expectItemsToMatch(newItems);
    });
  });

  describe('slidesChange event', () => {
    let eventEmitterSpy: jasmine.Spy;
    let allPossibleSlides: ISlide<TestItem>[];

    beforeEach(() => {
      eventEmitterSpy = testUtils.getSlidesChangeSpy();
      eventEmitterSpy.calls.reset();

      allPossibleSlides = items.map((item, index) =>
        testUtils.getSlideFromItem(item, index)
      );
    });

    it('should emit when the slides are changed', () => {
      testUtils.swipeToNext();
      const expectedSlides = allPossibleSlides.slice(1, nbSlides + 1);

      expect(eventEmitterSpy).toHaveBeenCalledOnceWith(expectedSlides);
    });
  });

  describe('activeItemIndexChange event', () => {
    let eventEmitterSpy: jasmine.Spy;

    beforeEach(() => {
      eventEmitterSpy = testUtils.getActiveItemIndexChangeSpy();
      eventEmitterSpy.calls.reset();
    });

    const expectedEmittedValues = [3, 1, 2];
    expectedEmittedValues.forEach((expectedValue) => {
      it('should emit when the active-item index changes', () => {
        testUtils.activateItem(expectedValue);

        testUtils.expectActiveItemIndexToBeEmitted(
          expectedValue,
          eventEmitterSpy
        );
      });
    });
  });
});

async function restartTestUtils(
  testUtils: SwiperComponentTestUtils,
  inputs: {
    items: TestItem[];
    nbSlides: number;
  }
): Promise<SwiperComponentTestUtils> {
  if (testUtils) {
    testUtils.resetTestingModule();
  }
  const utils = new SwiperComponentTestUtils(
    SwiperWrapperComponent,
    { imports: [SwiperWrapperComponent, SwiperComponent<TestItem>] },
    inputs
  );
  await utils.globalBeforeEach();
  return utils;
}
