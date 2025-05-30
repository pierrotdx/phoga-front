import { Observable } from 'rxjs';
import { ISwiperState } from './swiper-state';

export interface ISwiper<T> {
  stateChange$: Observable<ISwiperState<T>>;
  swipeToNext: () => void;
  swipeToPrevious: () => void;
  swipeToItem(itemIndex: number): void;
  activateItem(slideIndex: number | undefined): void;
  addItems(itemsToAdd: T[]): void;
  getItems(): T[];
}
