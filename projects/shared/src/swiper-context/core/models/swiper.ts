import { Observable } from 'rxjs';
import { ISwiperState } from './swiper-state';
import { IAutoSwipeOptions } from './auto-swipe-options';

export interface ISwiper<T> {
  stateChange$: Observable<ISwiperState<T>>;
  setLoop: (loop: boolean) => void;
  autoSwipeStart(options: IAutoSwipeOptions): void;
  autoSwipeStop(): void;
  swipeToNext: () => void;
  swipeToPrevious: () => void;
  swipeToItem(itemIndex: number): void;
  activateItem(slideIndex: number | undefined): void;
  addItems(itemsToAdd: T[]): void;
  getItems(): T[];
}
