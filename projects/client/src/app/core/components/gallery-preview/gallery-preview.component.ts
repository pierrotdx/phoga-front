import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { PhotoImageComponent } from '@client/photo-context';
import { GalleryService, IGallery, IPhoto } from '@shared/photo-context';
import AutoScroll from 'embla-carousel-auto-scroll';

import EmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from 'embla-carousel';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-preview',
  imports: [PhotoImageComponent, MaterialIconComponent],
  templateUrl: './gallery-preview.component.html',
  styleUrl: './gallery-preview.component.scss',
})
export class GalleryPreviewComponent implements OnDestroy, AfterViewInit {
  gallery = input.required<IGallery>();
  reverseDirection = input<boolean>(false);
  delay = input<number>(0);
  photos = signal<IPhoto[]>([]);
  carouselNode = viewChild<ElementRef<HTMLElement>>('carousel');

  private carousel: EmblaCarouselType | undefined;

  private photosSub: Subscription | undefined;

  constructor(
    private readonly galleryService: GalleryService,
    private readonly router: Router
  ) {
    effect(this.onGalleryInput);
  }

  private readonly onGalleryInput = (): void => {
    const gallery = this.gallery();
    this.subToPhotos(gallery);
  };

  private subToPhotos(gallery: IGallery): void {
    if (this.photosSub) {
      this.photosSub.unsubscribe();
    }
    const photos$ = gallery.galleryPhotos$.pipe(
      map((galleryPhotos) => galleryPhotos.all)
    );
    this.photosSub = photos$.subscribe(this.onPhotosChange);
  }

  private onPhotosChange = async (photos: IPhoto[]) => {
    this.photos.set(photos);
  };

  ngAfterViewInit(): void {
    this.configCarousel();
  }

  private configCarousel(): void {
    const carouselNode = this.carouselNode();
    if (!carouselNode) {
      return;
    }

    const options: EmblaOptionsType = {
      loop: true,
      axis: 'x',
    };

    const plugins: EmblaPluginType[] = [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: true,
        speed: 0.8,
        startDelay: this.delay(),
        direction: this.reverseDirection() ? 'backward' : 'forward',
      }),
    ];
    if (this.carousel) {
      delete this.carousel;
    }
    this.carousel = EmblaCarousel(carouselNode.nativeElement, options, plugins);
  }

  startScrolling() {
    this.carousel?.plugins().autoScroll.play();
  }

  stopScrolling() {
    this.carousel?.plugins().autoScroll.stop();
  }

  navToGallery(): void {
    const id = this.gallery()._id;
    this.galleryService.select(id);
    this.router.navigate(['/'], {
      fragment: 'gallery',
    });
  }

  ngOnDestroy(): void {
    this.photosSub?.unsubscribe();
  }
}
