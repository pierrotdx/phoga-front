import {
  Component,
  EventEmitter,
  input,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';
import { SubscriptionHandler } from '@shared/subscription-handler-context';
import { ISlide, ISlider } from '../models';
import { Slider } from '../slider/slider';

@Component({
  selector: 'lib-slider',
  imports: [NgTemplateOutlet],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent<T extends { _id: string }>
  implements OnChanges, OnDestroy
{
  nbSlides = input.required<number>();
  items = input.required<T[]>();
  slideTemplate = input.required<TemplateRef<any>>();

  private _activateItem$: Observable<number | undefined> | undefined;
  @Input() set activateItem$(
    value: Observable<number | undefined> | undefined
  ) {
    this._activateItem$ = value;
    this.activateItemHandler.subscribeTo(value);
  }
  get activateItem$() {
    return this._activateItem$;
  }

  private _swipeToNext$: Observable<void> | undefined;
  @Input() set swipeToNext$(value: Observable<void> | undefined) {
    this.swipeToNextHandler.subscribeTo(value);
  }
  get swipeToNext$() {
    return this._swipeToNext$;
  }

  private _swipeToPrevious$: Observable<void> | undefined;
  @Input() set swipeToPrevious$(value: Observable<void> | undefined) {
    this.swipeToPreviousHandler.subscribeTo(value);
  }
  get swipeToPrevious$() {
    return this._swipeToPrevious$;
  }

  private _addItems$: Observable<T[]> | undefined;
  @Input() set addItems$(value: Observable<T[]> | undefined) {
    this.addItemHandler.subscribeTo(value);
  }
  get addItems$() {
    return this._addItems$;
  }

  @Output() slidesChange = new EventEmitter<ISlide<T>[]>();
  @Output() activeItemIndexChange = new EventEmitter<number | undefined>();

  slides = signal<ISlide<T>[]>([]);

  private slider!: ISlider<T>;
  private readonly activateItemHandler: SubscriptionHandler<number | undefined>;
  private readonly swipeToNextHandler: SubscriptionHandler<void>;
  private readonly swipeToPreviousHandler: SubscriptionHandler<void>;
  private readonly addItemHandler: SubscriptionHandler<T[]>;

  private readonly slidesHandler: SubscriptionHandler<ISlide<T>[]>;
  private readonly activeItemIndexHandler: SubscriptionHandler<
    number | undefined
  >;

  private readonly subs: SubscriptionHandler<any>[] = [];

  constructor() {
    this.activateItemHandler = new SubscriptionHandler<number | undefined>(
      this.onActivateItem
    );
    this.subs.push(this.activateItemHandler);

    this.swipeToNextHandler = new SubscriptionHandler<void>(this.onSwipeToNext);
    this.subs.push(this.swipeToNextHandler);

    this.swipeToPreviousHandler = new SubscriptionHandler<void>(
      this.onSwipeToPrevious
    );
    this.subs.push(this.swipeToPreviousHandler);

    this.addItemHandler = new SubscriptionHandler<T[]>(this.onAddItems);
    this.subs.push(this.addItemHandler);

    this.slidesHandler = new SubscriptionHandler<ISlide<T>[]>(this.onSlides);
    this.subs.push(this.slidesHandler);

    this.activeItemIndexHandler = new SubscriptionHandler<number | undefined>(
      this.onActiveItemIndex
    );
    this.subs.push(this.activateItemHandler);
  }

  ngOnChanges() {
    this.setSlider();
  }

  private setSlider(): void {
    this.slider = new Slider<T>({
      items: this.items(),
      nbSlides: this.nbSlides(),
    });
    this.slidesHandler.subscribeTo(this.slider.slides$);
    this.activeItemIndexHandler.subscribeTo(this.slider.activeItemIndex$);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private onActivateItem = (index: number | undefined): void => {
    this.activateItem(index);
  };

  private onSwipeToNext = (): void => {
    this.slider.swipeToNext();
  };

  private onSwipeToPrevious = (): void => {
    this.slider.swipeToPrevious();
  };

  private onAddItems = (itemsToAdd: T[]): void => {
    this.slider.addItems(itemsToAdd);
  };

  private onSlides = (slides: ISlide<T>[]): void => {
    this.slides.set(slides);
    this.slidesChange.emit(slides);
  };

  private onActiveItemIndex = (activeItemIndex: number | undefined): void => {
    this.activeItemIndexChange.emit(activeItemIndex);
  };

  activateItem(index: number | undefined): void {
    this.slider.activateItem(index);
  }
}
