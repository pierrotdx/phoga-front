import { ISlide } from './slide';

export interface ISwiperState<T> {
  slides: ISlide<T>[];
  activeItemIndex?: number;
}
