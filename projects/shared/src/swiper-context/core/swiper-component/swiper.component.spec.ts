import { ISlide, ISwiperInitOptions } from '../models';
import { SwiperComponent } from './swiper.component';
import { SwiperWrapperComponent, TestItem } from './swiper-component-tests';
import { SwiperComponentTestExpects } from './swiper-component-tests';

// Need to test the swiper component
// via a wrapping component
// because it has an input being a template ref:
// https://stackoverflow.com/a/57019955/6281776
describe('SwiperComponent', () => {
  let testUtils: SwiperComponentTestExpects;
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

  afterEach(() => {
    testUtils.globalAfterEach();
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
    let startIndex = 1;

    beforeEach(() => {
      testUtils.startSlidesFromItem(startIndex);
    });

    it('should swipe to previous when asked to', () => {
      const initExpectedSlides = items.slice(startIndex, startIndex + nbSlides);
      testUtils.expectSlideValuesToMatch(initExpectedSlides);

      testUtils.swipeToPrevious();

      const afterSwipeExpectedSlides = items.slice(0, nbSlides);
      testUtils.expectSlideValuesToMatch(afterSwipeExpectedSlides);
    });
  });

  describe('swipeToItem', () => {
    beforeEach(() => {
      const startIndex = 0;
      testUtils.startSlidesFromItem(startIndex);
    });

    it('should swipe until the input item is displayed', () => {
      const targetedItemIndex = nbSlides;
      const isInSlidesBefore = testUtils.isItemInSlides(targetedItemIndex);
      expect(isInSlidesBefore).toBeFalse();

      testUtils.swipeToItem(targetedItemIndex);

      const isInSlidesAfter = testUtils.isItemInSlides(targetedItemIndex);
      expect(isInSlidesAfter).toBeTrue();
    });
  });

  describe('activateItem', () => {
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

  describe('itemsChange event', () => {
    let eventEmitterSpy: jasmine.Spy;
    let initItems: TestItem[];

    beforeEach(async () => {
      initItems = testUtils.getItems();
      eventEmitterSpy = testUtils.getOnItemsChangeSpy();
    });

    afterEach(() => {
      eventEmitterSpy.calls.reset();
    });

    it('should be emitted at items initialization', () => {
      expect(eventEmitterSpy).toHaveBeenCalledWith(initItems);
    });

    it('should be emitted when items are added', () => {
      const itemsToAdd: TestItem[] = [{ _id: 'e' }, { _id: 'p' }];
      const expectedEmittedItems = initItems.concat(itemsToAdd);

      testUtils.addItems(itemsToAdd);

      expect(eventEmitterSpy).toHaveBeenCalledWith(initItems);
      expect(eventEmitterSpy).toHaveBeenCalledWith(expectedEmittedItems);
    });
  });

  describe('swiperStateChange event', () => {
    let eventEmitterSpy: jasmine.Spy;

    beforeEach(() => {
      eventEmitterSpy = testUtils.getSwiperStateChangeSpy();
      eventEmitterSpy.calls.reset();
    });

    describe('when the active item changes', () => {
      const expectedEmittedValues = [3, 1, 2];

      expectedEmittedValues.forEach((expectedValue) => {
        it('should emit a state with the new active-item index', () => {
          testUtils.activateItem(expectedValue);

          expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
          testUtils.expectActiveItemIndexToBe(expectedValue);
        });
      });
    });

    describe('when slides change', () => {
      let allPossibleSlides: ISlide<TestItem>[];

      beforeEach(() => {
        eventEmitterSpy.calls.reset();

        allPossibleSlides = items.map((item, index) =>
          testUtils.getSlideFromItem(item, index)
        );
      });

      it('should emit when the slides are changed', () => {
        testUtils.swipeToNext();
        const expectedSlides = allPossibleSlides.slice(1, nbSlides + 1);

        expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
        const slides = testUtils.getSlides();
        expect(slides).toEqual(expectedSlides);
      });
    });
  });

  describe("swiper's initial state", () => {
    describe('by default', () => {
      it('should not have an active item', async () => {
        const expectedActiveItemIndex = undefined;

        testUtils = await restartTestUtils(testUtils, {
          items,
          nbSlides,
        });

        testUtils.expectActiveItemIndexToBe(expectedActiveItemIndex);
      });

      it('should have slides starting with the first item of the list', async () => {
        const expectedItemIndex = 0;

        testUtils = await restartTestUtils(testUtils, {
          items,
          nbSlides,
        });

        testUtils.expectFirstSlideItemIndexToBe(expectedItemIndex);
      });
    });

    describe('by init options', () => {
      let swiperInitOptions: ISwiperInitOptions = {};

      beforeEach(() => {
        swiperInitOptions = {};
      });

      it('should activate the item according to the input options', async () => {
        const expectedActiveItemIndex = 2;
        swiperInitOptions.activeItemIndex = expectedActiveItemIndex;

        testUtils = await restartTestUtils(testUtils, {
          items,
          nbSlides,
          swiperInitOptions,
        });

        testUtils.expectSwiperStateToMatchInitOptions(swiperInitOptions);
      });

      it('should have the slides starting from the input-options start item when there is enough items', async () => {
        const swiperInitOptions: ISwiperInitOptions = {
          slidesStartAt: 1,
        };

        testUtils = await restartTestUtils(testUtils, {
          items,
          nbSlides,
          swiperInitOptions,
        });

        testUtils.expectSwiperStateToMatchInitOptions(swiperInitOptions);
      });

      it('should have the slides containing the input-options start item when there is not enough items', async () => {
        const swiperInitOptions: ISwiperInitOptions = {
          slidesStartAt: nbSlides - 2,
        };

        testUtils = await restartTestUtils(testUtils, {
          items,
          nbSlides,
          swiperInitOptions,
        });

        testUtils.expectSwiperStateToMatchInitOptions(swiperInitOptions);
      });
    });
  });
});

async function restartTestUtils(
  testUtils: SwiperComponentTestExpects,
  inputs: {
    items: TestItem[];
    nbSlides: number;
    swiperInitOptions?: ISwiperInitOptions;
  }
): Promise<SwiperComponentTestExpects> {
  if (testUtils) {
    testUtils.resetTestingModule();
  }
  const utils = new SwiperComponentTestExpects(
    SwiperWrapperComponent,
    { imports: [SwiperWrapperComponent, SwiperComponent<TestItem>] },
    inputs
  );
  await utils.globalBeforeEach();
  return utils;
}
