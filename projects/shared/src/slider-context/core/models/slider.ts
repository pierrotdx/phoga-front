import { BehaviorSubject } from 'rxjs';
import { ISlide } from './slide';

export interface ISlider<T> {
  slides$: BehaviorSubject<ISlide<T>[]>;
  activeItemIndex$: BehaviorSubject<number | undefined>;
  swipeToNext: () => void;
  swipeToPrevious: () => void;
  swipeToItem(itemIndex: number): void;
  activateItem(slideIndex: number | undefined): void;
  addItems(itemsToAdd: T[]): void;
  getItems(): T[];
}
