import { Component, input, ViewChild } from '@angular/core';
import { SliderComponent } from '../slider.component';

import { Observable } from 'rxjs';
import { GetSlideContentFromItem, TestItem } from './models';

@Component({
  selector: 'slider-wrapper',
  template: `<ng-template #slideTemplate let-slide="slide">
      @if(getSlideContent(); as getSlideContent) {
      <div [class]="slideClass()">{{ getSlideContent(slide.value) }}</div>
      }
    </ng-template>
    <lib-slider
      class="slider"
      [slideTemplate]="slideTemplate"
      [nbSlides]="nbSlides()"
      [items]="items()"
      [swipeToNext$]="swipeToNext$()"
      [swipeToPrevious$]="swipeToPrevious$()"
      [activateItem$]="activateItem$()"
      [addItems$]="addItems$()"
    >
    </lib-slider>`,
  imports: [SliderComponent],
})
export class SliderWrapperComponent {
  nbSlides = input<number>(0);
  items = input<TestItem[]>([]);
  swipeToNext$ = input<Observable<void>>();
  swipeToPrevious$ = input<Observable<void>>();
  activateItem$ = input<Observable<number | undefined>>();
  addItems$ = input<Observable<TestItem[]>>();
  getSlideContent = input<GetSlideContentFromItem<TestItem>>();
  slideClass = input<string>();

  @ViewChild(SliderComponent<TestItem>)
  sliderComponent!: SliderComponent<TestItem>;
}
