export interface ISwiperState<T> {
  activeSlide?: {
    itemIndex: number;
    value: T;
  };
}
