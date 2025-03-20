import { Component, input, ViewChild } from '@angular/core';
import { SwiperComponent } from '../swiper.component';

import { Observable } from 'rxjs';
import { GetSlideContentFromItem, TestItem } from './models';
import { ISwiperInitOptions } from '@shared/public-api';

@Component({
  selector: 'swiper-wrapper',
  template: `<ng-template #slideTemplate let-slide="slide">
      @if(getSlideContent(); as getSlideContent) {
      <div [class]="slideClass()">{{ getSlideContent(slide.value) }}</div>
      }
    </ng-template>
    <lib-swiper
      [slideTemplate]="slideTemplate"
      [nbSlides]="nbSlides()"
      [items]="items()"
      [swipeToNext$]="swipeToNext$()"
      [swipeToPrevious$]="swipeToPrevious$()"
      [activateItem$]="activateItem$()"
      [addItems$]="addItems$()"
      [swiperInitOptions]="swiperInitOptions()"
    >
    </lib-swiper>`,
  imports: [SwiperComponent],
})
export class SwiperWrapperComponent {
  nbSlides = input<number>(0);
  items = input<TestItem[]>([]);
  swipeToNext$ = input<Observable<void>>();
  swipeToPrevious$ = input<Observable<void>>();
  activateItem$ = input<Observable<number | undefined>>();
  addItems$ = input<Observable<TestItem[]>>();
  getSlideContent = input<GetSlideContentFromItem<TestItem>>();
  slideClass = input<string>();
  swiperInitOptions = input<ISwiperInitOptions>();

  @ViewChild(SwiperComponent<TestItem>)
  swiperComponent!: SwiperComponent<TestItem>;
}
