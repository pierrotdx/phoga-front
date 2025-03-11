import { BehaviorSubject } from 'rxjs';
import { ISlide, ISlider } from '../models';

export class Slider<T> implements ISlider<T> {
  slides$ = new BehaviorSubject<ISlide<T>[]>([]);
  activeItemIndex$ = new BehaviorSubject<number | undefined>(undefined);

  private items$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  private slideItemIndices: number[] = [];
  private sliderSize: number = 0;
  private readonly nbSlides: number;

  constructor({ items = [], nbSlides }: { items?: T[]; nbSlides: number }) {
    this.nbSlides = nbSlides;
    this.subToItems();
    this.addItems(items);
  }

  addItems(itemsToAdd: T[] = []): void {
    const currentItems = this.items$.getValue();
    const items = currentItems.concat(itemsToAdd);
    this.items$.next(items);
  }

  private subToItems(): void {
    this.items$.subscribe((items) => this.onItemsChange(items));
  }

  private onItemsChange(items: T[]): void {
    this.setSliderSize();
    const isInit = this.slideItemIndices.length === 0;
    if (isInit) {
      this.setSlideItemIndices();
      this.activateItem(0);
    }
  }

  private async setSlideItemIndices(startItemIndex: number = 0): Promise<void> {
    this.slideItemIndices = [];
    for (
      let itemIndex = startItemIndex;
      itemIndex < this.sliderSize;
      itemIndex++
    ) {
      this.slideItemIndices.push(itemIndex);
    }
    this.emitSlides();
  }

  private setSliderSize(): void {
    this.sliderSize = Math.min(this.items$.getValue().length, this.nbSlides);
  }

  private emitSlides(): void {
    const items = this.items$?.getValue();
    const slides = this.slideItemIndices.map((itemIndex) => {
      const item = items[itemIndex];
      return this.buildSlide(item, itemIndex);
    });
    this.slides$.next(slides);
  }

  private buildSlide(item: T, itemIndex: number): ISlide<T> {
    return {
      itemIndex,
      value: item,
    };
  }

  next() {
    if (this.isNextDisabled()) {
      return;
    }
    this.slideItemIndices = this.slideItemIndices.map(
      (index) => (index + 1) % this.items$.getValue().length
    );
    this.emitSlides();
  }

  private isNextDisabled(): boolean {
    const itemsEndIndex = this.items$.getValue().length - 1;
    const slideEndIndex = this.slideItemIndices[this.nbSlides - 1];
    const isAtEnd = slideEndIndex === itemsEndIndex;
    return isAtEnd;
  }

  previous() {
    if (this.isPreviousDisabled()) {
      return;
    }
    this.slideItemIndices = this.slideItemIndices.map((index) => {
      const newIndex = (index - 1) % this.items$.getValue().length;
      return newIndex < 0 ? this.items$.getValue().length + newIndex : newIndex;
    });
    this.emitSlides();
  }

  private isPreviousDisabled(): boolean {
    const isOnStartingEdge = this.slideItemIndices[0] === 0;
    return isOnStartingEdge;
  }

  navToItem(itemIndex: number): void {
    const slideIndex = this.slideItemIndices.indexOf(itemIndex);
    const isAlreadyInSlides = slideIndex >= 0;
    if (isAlreadyInSlides) {
      return;
    }
    const isBeforeSlides = itemIndex < this.slideItemIndices[0];
    if (isBeforeSlides) {
      this.setSlideItemIndices(itemIndex);
    } else {
      const startIndex = itemIndex - (this.sliderSize - 1);
      this.setSlideItemIndices(startIndex);
    }
  }

  activateItem(itemIndex: number): void {
    const items = this.items$.getValue();
    if (itemIndex >= 0 && itemIndex < items.length) {
      this.activeItemIndex$.next(itemIndex);
    }
  }
}
