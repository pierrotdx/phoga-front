import { Component, effect, input, OnDestroy, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { splitEvery } from 'ramda';
import { PhotoStripComponent } from '../photo-strip/photo-strip.component';
import {
  IGallery,
  IGalleryPhotos,
  IPhoto,
  IPhotoStrip,
} from '@shared/photo-context';

@Component({
  selector: 'lib-gallery',
  imports: [MatProgressSpinnerModule, PhotoStripComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnDestroy {
  gallery = input.required<IGallery>();

  isLoading = signal<boolean>(false);

  photoStrips = signal<IPhotoStrip[]>([]);

  private readonly gallerySubs: Subscription[] = [];

  constructor() {
    effect(() => this.onGalleryChange());
  }

  private onGalleryChange(): void {
    this.cleanGallerySubs();
    this.resetPhotoPairs();

    const gallery = this.gallery();
    this.subToIsLoading(gallery);
    this.subToGalleryPhoto(gallery);
  }

  private cleanGallerySubs(): void {
    this.gallerySubs.forEach((sub) => sub.unsubscribe());
  }

  private resetPhotoPairs(): void {
    this.photoStrips.set([]);
  }

  private subToIsLoading(gallery: IGallery): void {
    const isLoading$ = gallery.isLoading$;
    const sub = isLoading$.subscribe((isLoading) =>
      this.onIsLoading(isLoading)
    );
    this.gallerySubs.push(sub);
  }

  private onIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  private subToGalleryPhoto(gallery: IGallery): void {
    const sub = gallery.galleryPhotos$.subscribe((galleryPhoto) =>
      this.onGalleryPhotos(galleryPhoto)
    );
    this.gallerySubs.push(sub);
  }

  private onGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    const strips = this.getPhotoStrips(galleryPhotos.all);
    this.photoStrips.set(strips);
  }

  private getPhotoStrips(photos: IPhoto[]): IPhotoStrip[] {
    const stripLength = 2;
    return splitEvery(stripLength)(photos);
  }

  ngOnDestroy(): void {
    this.cleanGallerySubs();
  }
}
