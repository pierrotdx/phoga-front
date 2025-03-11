import { BehaviorSubject } from 'rxjs';
import { ISlide } from './slide';

export interface ISlider<T> {
  slides$: BehaviorSubject<ISlide<T>[]>;
  activeItemIndex$: BehaviorSubject<number | undefined>;
  next: () => void;
  previous: () => void;
  navToItem(itemIndex: number): void;
  activateItem(slideIndex: number): void;
  addItems(itemsToAdd: T[]): void;
}
