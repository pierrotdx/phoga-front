import { Component, effect, input, OnDestroy, signal } from '@angular/core';

import { SwiperComponent } from '@shared/swiper-context';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { IGallery, IGalleryPhotos, IPhoto } from '@shared/photo-context';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  firstValueFrom,
  Observable,
  Subject,
  Subscribable,
  Subscription,
} from 'rxjs';
import { SubscriptionHandler } from '@shared/subscription-handler-context';
import { isEmpty } from 'ramda';
import { GalleryPaginationComponent } from '../gallery-pagination/gallery-pagination.component';

@Component({
  selector: 'app-photo-selection',
  imports: [
    SwiperComponent,
    PhotoImageComponent,
    MatProgressSpinner,
    GalleryPaginationComponent,
  ],
  templateUrl: './photo-selection.component.html',
  styleUrl: './photo-selection.component.scss',
})
export class PhotoSelectionComponent implements OnDestroy {
  gallery = input.required<IGallery>();
  selectNextPhoto$ = input<Observable<void>>();
  selectPreviousPhoto$ = input<Observable<void>>();

  private readonly activateItemEmitter = new Subject<number | undefined>();
  activateItem$ = this.activateItemEmitter.asObservable();

  private readonly swipeToItemEmitter = new Subject<number>();
  readonly swipeToItem$ = this.swipeToItemEmitter.asObservable();

  private readonly addItemsEmitter = new Subject<IPhoto[]>();
  readonly addItems$ = this.addItemsEmitter.asObservable();

  private readonly nbPreloadPhotos: number = 2;
  readonly nbSlides = 4;

  readonly initPhotos = signal<IPhoto[]>([]);
  readonly hasInitPhotos = signal<boolean>(false);

  private readonly subs: (Subscription | SubscriptionHandler<any>)[] = [];
  private readonly gallerySubs: (Subscription | SubscriptionHandler<any>)[] =
    [];

  constructor() {
    effect(() => this.onGalleryInput());
    effect(() => this.onSelectNextInput());
    effect(() => this.onSelectPreviousInput());
  }

  private onGalleryInput(): void {
    const gallery = this.gallery();

    this.clearGallerySubs();

    const afterFirstPhotosLoading$ = gallery.galleryPhotos$;
    this.setupSubHandler(
      afterFirstPhotosLoading$,
      this.onGalleryPhotos,
      this.gallerySubs
    );

    this.setupSubHandler(
      gallery.selectedPhoto$,
      this.onSelectedPhotoChange,
      this.gallerySubs
    );
  }

  private clearGallerySubs(): void {
    if (!isEmpty(this.gallerySubs)) {
      this.gallerySubs.forEach((sub) => sub.unsubscribe());
    }
  }

  private setupSubHandler<T>(
    observable: Subscribable<T> | undefined,
    onNext: (params: T) => void | Promise<void>,
    subsList: (Subscription | SubscriptionHandler<any>)[]
  ): void {
    const handler = new SubscriptionHandler<T>(onNext);
    handler.subscribeTo(observable);
    subsList.push(handler);
  }

  private readonly onFirstPhotosLoading = async (): Promise<void> => {
    const gallery = this.gallery();
    const galleryPhotos = await firstValueFrom(gallery.galleryPhotos$);
    const nbMissingPhotos = this.nbSlides - galleryPhotos.all.length;
    if (nbMissingPhotos > 0 && this.gallery().hasMorePhotosToLoad()) {
      await gallery.loadMore(nbMissingPhotos);
      return;
    }
    this.initPhotos.set(galleryPhotos.all);
    this.hasInitPhotos.set(true);
  };

  private readonly onGalleryPhotos = async (
    galleryPhotos: IGalleryPhotos
  ): Promise<void> => {
    if (!this.hasInitPhotos()) {
      await this.onFirstPhotosLoading();
    }
    this.addItemsEmitter.next(galleryPhotos.lastBatch);
  };

  private readonly onSelectedPhotoChange = async (
    newSelectedPhoto: IPhoto | undefined
  ): Promise<void> => {
    if (newSelectedPhoto) {
      const photoIndex = await this.getPhotoIndex(newSelectedPhoto);
      this.activateItemEmitter.next(photoIndex);
      this.swipeToItem(photoIndex);
      await this.triggerPreloadIfNecessary(newSelectedPhoto);
    } else {
      this.activateItemEmitter.next(undefined);
    }
  };

  private async triggerPreloadIfNecessary(
    selectedPhoto: IPhoto
  ): Promise<void> {
    const galleryPhotos = await firstValueFrom(this.gallery().galleryPhotos$);
    const triggerPreloadIndex = galleryPhotos.all.length - this.nbPreloadPhotos;
    const selectedPhotoIndex = await this.getPhotoIndex(selectedPhoto);
    if (selectedPhotoIndex >= triggerPreloadIndex) {
      await this.gallery().loadMore();
    }
  }

  private async getPhotoIndex(photo: IPhoto): Promise<number> {
    const galleryPhotos = await firstValueFrom(this.gallery().galleryPhotos$);
    return galleryPhotos.all.findIndex((p) => p._id === photo._id);
  }

  private swipeToItem(itemIndex: number): void {
    this.swipeToItemEmitter.next(itemIndex);
  }

  private onSelectNextInput(): void {
    this.setupSubHandler(this.selectNextPhoto$(), this.onSelectNext, this.subs);
  }

  private readonly onSelectNext = async (): Promise<void> => {
    await this.gallery().selectNextPhoto();
  };

  private onSelectPreviousInput(): void {
    this.setupSubHandler(
      this.selectPreviousPhoto$(),
      this.onSelectPrevious,
      this.subs
    );
  }

  private readonly onSelectPrevious = (): void => {
    this.gallery().selectPreviousPhoto();
  };

  selectPhoto = (id: IPhoto['_id']): void => {
    this.gallery().selectPhoto(id);
  };

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.clearGallerySubs();
  }
}
