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
import {
  GalleryService,
  IGalleryPhotos,
  IPhoto,
  ISelectedPhoto,
} from '@shared/photo-context';
import { PhotoSelectionLoader } from './photo-selection-loader/photo-selection-loader';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { SubscriptionHandler } from '@shared/subscription-handler-context';

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

  readonly nbSlides = 6;
  readonly initPhotos = signal<IPhoto[]>([]);
  readonly hasInitPhotos = signal<boolean>(false);

  private swipeToItemEmitter = new Subject<number>();
  readonly swipeToItem$ = this.swipeToItemEmitter.asObservable();

  private readonly selectedPhoto$ = new BehaviorSubject<ISelectedPhoto>(
    undefined
  );
  private readonly selectedPhotoHandler: SubscriptionHandler<
    IPhoto | undefined
  >;

  private readonly photos$ = new BehaviorSubject<IGalleryPhotos>({
    all: [],
    lastBatch: [],
  });
  private readonly photosHandler: SubscriptionHandler<IGalleryPhotos>;

  private readonly addItemsEmitter = new Subject<IPhoto[]>();
  readonly addItems$ = this.addItemsEmitter.asObservable();

  swiperElement = viewChild(SwiperComponent);
  private hasSwiperViewInit = false;

  private readonly photoLoader: PhotoSelectionLoader;
  private readonly subs: (Subscription | SubscriptionHandler<any>)[] = [];

  constructor(private readonly galleryService: GalleryService) {
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
    this.subToSelectedPhoto();
    this.subToGalleryPhotos();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private subToSelectedPhoto(): void {
    const sub = this.galleryService.selectedPhoto$.subscribe(
      (selectedPhoto) => {
        this.selectedPhoto$.next(selectedPhoto);
      }
    );
    this.subs.push(sub);
  }

  private subToGalleryPhotos(): void {
    const sub = this.galleryService.galleryPhotos$.subscribe(
      (galleryPhotos) => {
        this.photos$.next(galleryPhotos);
      }
    );
    this.subs.push(sub);
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
    const selectedPhoto = this.selectedPhoto$.getValue();
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
