import {
  Component,
  effect,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

import { ISwiperState, SwiperComponent } from '@shared/swiper-context';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { IPhoto } from '@shared/photo-context';
import { PhotoSelectionLoader } from './photo-selection-loader/photo-selection-loader';
import { GalleryService } from '@client/app/services';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SubscriptionHandler } from '@shared/subscription-handler-context';
import { IGalleryPhotos } from '../../../models';

@Component({
  selector: 'app-photo-selection',
  imports: [SwiperComponent, PhotoImageComponent, MatProgressSpinner],
  templateUrl: './photo-selection.component.html',
  styleUrl: './photo-selection.component.scss',
})
export class PhotoSelectionComponent implements OnInit, OnDestroy {
  selectNextPhoto$ = input<Observable<void>>();
  private readonly selectNextSubHandler: SubscriptionHandler<void>;

  selectPreviousPhoto$ = input<Observable<void>>();
  private readonly selectPreviousSubHandler: SubscriptionHandler<void>;

  private readonly activateItemEmitter = new Subject<number | undefined>();
  activateItem$ = this.activateItemEmitter.asObservable();

  readonly nbSlides = 4;
  readonly initPhotos = signal<IPhoto[]>([]);
  readonly hasInitPhotos = signal<boolean>(false);

  private swipeToItemEmitter = new Subject<number>();
  readonly swipeToItem$ = this.swipeToItemEmitter.asObservable();

  private readonly selectedPhoto$: BehaviorSubject<IPhoto | undefined>;
  private readonly selectedPhotoHandler: SubscriptionHandler<
    IPhoto | undefined
  >;

  private readonly photos$: BehaviorSubject<IGalleryPhotos>;
  private readonly photosHandler: SubscriptionHandler<IGalleryPhotos>;

  private readonly addItemsEmitter = new Subject<IPhoto[]>();
  readonly addItems$ = this.addItemsEmitter.asObservable();

  swiperElement = viewChild(SwiperComponent);
  private hasSwiperViewInit = false;

  private readonly photoLoader: PhotoSelectionLoader;
  private readonly subs: SubscriptionHandler<any>[] = [];

  constructor(private readonly galleryService: GalleryService) {
    this.selectedPhoto$ = this.galleryService.selectedPhoto$;
    this.photos$ = this.galleryService.photos$;
    this.photoLoader = new PhotoSelectionLoader(
      this.galleryService,
      this.nbSlides
    );

    this.selectedPhotoHandler = new SubscriptionHandler<IPhoto | undefined>(
      this.onSelectedPhotoChange
    );
    this.selectedPhotoHandler.subscribeTo(this.selectedPhoto$);
    this.subs.push(this.selectedPhotoHandler);

    this.photosHandler = new SubscriptionHandler<IGalleryPhotos>(this.onPhotos);
    this.photosHandler.subscribeTo(this.photos$);
    this.subs.push(this.photosHandler);

    this.selectNextSubHandler = new SubscriptionHandler<void>(
      this.onSelectNext
    );
    this.subs.push(this.selectNextSubHandler);
    effect(() => this.subToSelectNextInput());

    this.selectPreviousSubHandler = new SubscriptionHandler<void>(
      this.onSelectPrevious
    );
    this.subs.push(this.selectPreviousSubHandler);
    effect(() => this.subToSelectPreviousInput());

    effect(() => {
      if (!this.swiperElement() || this.hasSwiperViewInit) {
        return;
      }
      this.onSwiperViewInit();
      this.hasSwiperViewInit = true;
    });
  }

  private readonly onSelectedPhotoChange = (
    newSelectedPhoto: IPhoto | undefined
  ): void => {
    if (newSelectedPhoto) {
      const photoIndex = this.getPhotoIndex(newSelectedPhoto);
      this.activateItemEmitter.next(photoIndex);
      this.swipeToItem(photoIndex);
    } else {
      this.activateItemEmitter.next(undefined);
    }
  };

  private getPhotoIndex(photo: IPhoto): number {
    return this.getPhotos().all.findIndex((p) => p._id === photo._id);
  }

  private getPhotos(): IGalleryPhotos {
    return this.photos$.getValue();
  }

  private onSwiperViewInit(): void {
    this.refreshView();
  }

  private swipeToItem(itemIndex: number): void {
    this.swipeToItemEmitter.next(itemIndex);
  }

  ngOnInit(): void {
    void this.setInitPhotos();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private subToSelectNextInput(): void {
    const selectNext$ = this.selectNextPhoto$();
    this.selectNextSubHandler.subscribeTo(selectNext$);
  }

  private subToSelectPreviousInput(): void {
    const selectPrevious$ = this.selectPreviousPhoto$();
    this.selectPreviousSubHandler.subscribeTo(selectPrevious$);
  }

  private onSelectNext = (): void => {
    const selectedPhoto = this.selectedPhoto$.getValue();
    const currentSelectedPhotoIndex = selectedPhoto
      ? this.getPhotoIndex(selectedPhoto)
      : -1;
    const newSelectedPhotoIndex = currentSelectedPhotoIndex + 1;
    if (newSelectedPhotoIndex < this.photos$.getValue().all.length) {
      this.selectPhoto(newSelectedPhotoIndex);
    }
  };

  private onSelectPrevious = (): void => {
    const selectedPhoto = this.selectedPhoto$.getValue();
    const currentSelectedPhotoIndex = selectedPhoto
      ? this.getPhotoIndex(selectedPhoto)
      : 1;
    const newSelectedPhotoIndex = currentSelectedPhotoIndex - 1;
    if (newSelectedPhotoIndex >= 0) {
      this.selectPhoto(newSelectedPhotoIndex);
    }
  };

  selectPhoto(itemIndex: number | undefined): void {
    if (itemIndex !== undefined) {
      const selectedPhoto = this.getPhotos().all[itemIndex];
      this.galleryService.selectPhoto(selectedPhoto._id);
    } else {
      this.galleryService.deselectPhoto();
    }
  }

  private async setInitPhotos(): Promise<void> {
    const initPhotos = await this.photoLoader.getInitPhotos();
    this.initPhotos.set(initPhotos.all);
    this.hasInitPhotos.set(true);
  }

  private refreshView(): void {
    const selectedPhoto = this.galleryService.selectedPhoto$.getValue();
    this.onSelectedPhotoChange(selectedPhoto);
  }

  private onPhotos = (photos: IGalleryPhotos): void => {
    const loadedPhotos = photos.lastBatch;
    this.addItemsEmitter.next(loadedPhotos);
  };

  onSwiperStateChange = (swiperState: ISwiperState<IPhoto>): void => {
    this.photoLoader.onSwiperStateChange(swiperState);
  };
}
