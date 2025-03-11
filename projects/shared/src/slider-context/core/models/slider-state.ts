export interface ISliderState<T> {
  activeSlide?: {
    itemIndex: number;
    value: T;
  };
}
