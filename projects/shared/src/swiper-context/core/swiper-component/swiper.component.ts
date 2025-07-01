import {
  Component,
  effect,
  EventEmitter,
  input,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';
import { SubscriptionHandler } from '../../../subscription-handler-context';
import {
  ISlide,
  ISwiper,
  ISwiperState,
  ISwiperInitOptions,
  IAutoSwipeOptions,
} from '../models';
import { Swiper } from '../swiper/swiper';

@Component({
  selector: 'lib-swiper',
  imports: [NgTemplateOutlet],
  templateUrl: './swiper.component.html',
})
export class SwiperComponent<T extends { _id: string }> implements OnDestroy {
  readonly nbSlides = input.required<number>();
  readonly items = input.required<T[]>();
  readonly slideTemplate = input.required<TemplateRef<any>>();
  readonly swiperInitOptions = input<ISwiperInitOptions>();

  readonly activateItem$ = input<Observable<number | undefined>>();
  readonly swipeToNext$ = input<Observable<void>>();
  readonly swipeToPrevious$ = input<Observable<void>>();
  readonly swipeToItem$ = input<Observable<number>>();
  readonly addItems$ = input<Observable<T[]>>();
  readonly loop = input<boolean>(false);
  readonly autoSwipeStart$ = input<Observable<IAutoSwipeOptions | undefined>>();
  readonly autoSwipeStop$ = input<Observable<void>>();

  @Output() swiperStateChange = new EventEmitter<ISwiperState<T>>();
  @Output() itemsChange = new EventEmitter<T[]>();

  slides = signal<ISlide<T>[]>([]);
  private swiper!: ISwiper<T>;

  private readonly activateItemHandler: SubscriptionHandler<number | undefined>;
  private readonly swipeToNextHandler: SubscriptionHandler<void>;
  private readonly autoSwipeStartHandler: SubscriptionHandler<
    IAutoSwipeOptions | undefined
  >;
  private readonly autoSwipeStopHandler: SubscriptionHandler<void>;

  private readonly swipeToPreviousHandler: SubscriptionHandler<void>;
  private readonly swipeToItemHandler: SubscriptionHandler<number>;
  private readonly addItemHandler: SubscriptionHandler<T[]>;
  private readonly swiperStateHandler: SubscriptionHandler<ISwiperState<T>>;

  private readonly subs: SubscriptionHandler<any>[] = [];

  constructor() {
    effect(() => this.initSwiper());

    effect(() => this.activateItemEffectFn());
    this.activateItemHandler = new SubscriptionHandler<number | undefined>(
      this.onActivateItem
    );
    this.subs.push(this.activateItemHandler);

    effect(() => this.swipeToNextEffectFn());
    this.swipeToNextHandler = new SubscriptionHandler<void>(this.onSwipeToNext);
    this.subs.push(this.swipeToNextHandler);

    effect(() => this.swipeToPreviousEffectFn());
    this.swipeToPreviousHandler = new SubscriptionHandler<void>(
      this.onSwipeToPrevious
    );
    this.subs.push(this.swipeToPreviousHandler);

    effect(() => this.autoSwipeStartEffectFn());
    this.autoSwipeStartHandler = new SubscriptionHandler<
      IAutoSwipeOptions | undefined
    >(this.onAutoSwipeStart);
    this.subs.push(this.autoSwipeStartHandler);

    effect(() => this.autoSwipeStopEffectFn());
    this.autoSwipeStopHandler = new SubscriptionHandler<void>(
      this.onAutoSwipeStop
    );
    this.subs.push(this.autoSwipeStopHandler);

    effect(() => this.swipeToItemEffectFn());
    this.swipeToItemHandler = new SubscriptionHandler<number>(
      this.onSwipeToItem
    );
    this.subs.push(this.swipeToItemHandler);

    effect(() => this.addItemEffectFn());
    this.addItemHandler = new SubscriptionHandler<T[]>(this.onAddItems);
    this.subs.push(this.addItemHandler);

    this.swiperStateHandler = new SubscriptionHandler<ISwiperState<T>>(
      this.onSwiperStateChange
    );
    this.subs.push(this.swiperStateHandler);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private initSwiper(): void {
    const nbSlides = this.nbSlides();
    const items = this.items();
    this.swiper = new Swiper<T>({
      items,
      nbSlides,
    });
    const loop = this.loop();
    this.swiper.setLoop(loop);
    this.swiperStateHandler.subscribeTo(this.swiper.stateChange$);

    this.emitItems();

    const swiperInitOptions = this.swiperInitOptions();
    if (typeof swiperInitOptions?.activeItemIndex === 'number') {
      this.activateItem(swiperInitOptions.activeItemIndex);
    }
    if (typeof swiperInitOptions?.slidesStartAt === 'number') {
      this.swipeToItem(swiperInitOptions.slidesStartAt);
    }
  }

  private readonly onSwiperStateChange = (
    swiperState: ISwiperState<T>
  ): void => {
    this.slides.set(swiperState.slides);
    this.swiperStateChange.emit(swiperState);
  };

  private activateItemEffectFn() {
    const activateItem$ = this.activateItem$();
    this.activateItemHandler.subscribeTo(activateItem$);
  }

  private readonly onActivateItem = (index: number | undefined): void => {
    this.activateItem(index);
  };

  activateItem(index: number | undefined): void {
    this.swiper.activateItem(index);
  }

  private swipeToNextEffectFn() {
    const swipeToNext$ = this.swipeToNext$();
    this.swipeToNextHandler.subscribeTo(swipeToNext$);
  }

  private readonly onSwipeToNext = (): void => {
    this.swiper.swipeToNext();
  };

  private swipeToPreviousEffectFn(): void {
    const swipeToPrevious$ = this.swipeToPrevious$();
    this.swipeToPreviousHandler.subscribeTo(swipeToPrevious$);
  }

  private readonly onSwipeToPrevious = (): void => {
    this.swiper.swipeToPrevious();
  };

  private autoSwipeStartEffectFn() {
    const autoSwipeStart$ = this.autoSwipeStart$();
    this.autoSwipeStartHandler.subscribeTo(autoSwipeStart$);
  }

  private readonly onAutoSwipeStart = (options?: IAutoSwipeOptions) => {
    this.swiper.autoSwipeStart(options);
  };

  private autoSwipeStopEffectFn() {
    const autoSwipeStop$ = this.autoSwipeStop$();
    this.autoSwipeStopHandler.subscribeTo(autoSwipeStop$);
  }

  private readonly onAutoSwipeStop = () => {
    this.swiper.autoSwipeStop();
  };

  private swipeToItemEffectFn(): void {
    const swipeToItem$ = this.swipeToItem$();
    this.swipeToItemHandler.subscribeTo(swipeToItem$);
  }

  private readonly onSwipeToItem = (itemIndex: number): void => {
    this.swipeToItem(itemIndex);
  };

  private swipeToItem(itemIndex: number): void {
    this.swiper.swipeToItem(itemIndex);
  }

  private addItemEffectFn(): void {
    const addItem$ = this.addItems$();
    this.addItemHandler.subscribeTo(addItem$);
  }

  private readonly onAddItems = (itemsToAdd: T[]): void => {
    this.swiper.addItems(itemsToAdd);
    this.emitItems();
  };

  private emitItems(): void {
    const items = this.swiper.getItems();
    this.itemsChange.emit(items);
  }
}
