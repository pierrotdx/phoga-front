export interface IAutoSwipeOptions {
  timeOnSlideInMs?: number;
  direction?: AutoSwipeDirection;
}

export enum AutoSwipeDirection {
  Forward = 'forward',
  Backward = 'backward',
}
