import { distinctUntilChanged, ReplaySubject } from 'rxjs';
import { ISlide, ISwiper, ISwiperState } from '../models';
import { clone, equals } from 'ramda';

export class Swiper<T> implements ISwiper<T> {
  private _stateChange$ = new ReplaySubject<ISwiperState<T>>(1);
  readonly stateChange$ = this._stateChange$
    .asObservable()
    .pipe(distinctUntilChanged(equals<ISwiperState<T>>));

  private readonly state: ISwiperState<T> = {
    slides: [],
  };

  private items: T[] = [];

  private slideItemIndices: number[] = [];
  private swiperSize: number = 0;
  private readonly nbSlides: number;

  constructor({ items = [], nbSlides }: { items?: T[]; nbSlides: number }) {
    this.nbSlides = nbSlides;
    this.addItems(items);
  }

  addItems(itemsToAdd: T[] = []): void {
    this.items = this.items.concat(itemsToAdd);
    this.onItemsChange();
  }

  private onItemsChange(): void {
    this.setSwiperSize();
    const startFromItemIndex = this.slideItemIndices[0] || 0;
    this.setSlideItemIndices(startFromItemIndex);
    this.updateSlides();
    this.emitState();
  }

  private setSwiperSize(): void {
    this.swiperSize = Math.min(this.items.length, this.nbSlides);
  }

  private setSlideItemIndices(startItemIndex: number): void {
    let index = startItemIndex;
    this.slideItemIndices = [];
    let size = 0;
    while (size < this.swiperSize) {
      this.slideItemIndices.push(index % this.items.length);
      index++;
      size++;
    }
  }

  private updateSlides(): void {
    const slides = this.slideItemIndices.map((itemIndex) => {
      const item = this.items[itemIndex];
      return this.buildSlide(item, itemIndex);
    });
    this.state.slides = slides;
  }

  private buildSlide(item: T, itemIndex: number): ISlide<T> {
    const isActive = itemIndex === this.state.activeItemIndex;
    return {
      itemIndex,
      value: item,
      isActive,
    };
  }

  private emitState(): void {
    const stateToEmit = clone(this.state);
    this._stateChange$.next(stateToEmit);
  }

  swipeToNext() {
    if (this.isNextDisabled()) {
      return;
    }
    this.slideItemIndices = this.slideItemIndices.map(
      (index) => (index + 1) % this.items.length
    );
    this.updateSlides();
    this.emitState();
  }

  private isNextDisabled(): boolean {
    const itemsEndIndex = this.items.length - 1;
    const slideEndIndex = this.slideItemIndices[this.nbSlides - 1];
    const isAtEnd = slideEndIndex === itemsEndIndex;
    return isAtEnd;
  }

  swipeToPrevious() {
    if (this.isPreviousDisabled()) {
      return;
    }
    this.slideItemIndices = this.slideItemIndices.map((index) => {
      const newIndex = (index - 1) % this.items.length;
      return newIndex < 0 ? this.items.length + newIndex : newIndex;
    });
    this.updateSlides();
    this.emitState();
  }

  private isPreviousDisabled(): boolean {
    const isOnStartingEdge = this.slideItemIndices[0] === 0;
    return isOnStartingEdge;
  }

  swipeToItem(itemIndex: number): void {
    const isAlreadyInSlides = this.slideItemIndices.some(
      (index) => index === itemIndex
    );
    if (isAlreadyInSlides) {
      return;
    }
    const isBeforeSlides = itemIndex < this.slideItemIndices[0];
    if (isBeforeSlides) {
      this.setSlideItemIndices(itemIndex);
    } else {
      const startIndex = itemIndex - (this.swiperSize - 1);
      this.setSlideItemIndices(startIndex);
    }
    this.updateSlides();
    this.emitState();
  }

  activateItem(itemIndex: number | undefined): void {
    this.updateActiveItem(itemIndex);
    this.updateSlides();
    this.emitState();
  }

  private updateActiveItem(itemIndex: number | undefined): void {
    const items = this.items;
    const isOutRange = itemIndex! < 0 || itemIndex! >= items.length;
    if (itemIndex === undefined || isOutRange) {
      delete this.state.activeItemIndex;
    } else {
      this.state.activeItemIndex = itemIndex;
    }
  }

  getItems(): T[] {
    return this.items || [];
  }
}
