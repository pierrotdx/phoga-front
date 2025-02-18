import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { CollageComponent } from '@client/app/components';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IPhoto, PhotoApiService } from '@shared/photo-context';

@Component({
  selector: 'app-gallery',
  imports: [
    AsyncPipe,
    CollageComponent,
    InfiniteScrollDirective,
    MatProgressSpinnerModule,
    MatProgressSpinner,
  ],
  templateUrl: './gallery.component.html',
})
export class GalleryComponent implements OnInit {
  photos$ = new BehaviorSubject<IPhoto[]>([]);
  isLoading = signal<boolean>(false);

  private size = 3;
  private from = 1;
  private hasMoreToLoad = true;

  constructor(private readonly photoApiService: PhotoApiService) {}

  ngOnInit() {
    void this.loadPhotos();
  }

  async loadPhotos() {
    if (!this.isAllowedToLoadPhotos()) {
      return;
    }
    const loadedPhotos = await this.fetchPhotos();
    if (!loadedPhotos) {
      return;
    }
    this.from += loadedPhotos.length;
    this.hasMoreToLoad = loadedPhotos.length === this.size;
    this.updatePhotos(loadedPhotos);
  }

  private isAllowedToLoadPhotos(): boolean {
    // one loading at a time
    return !this.isLoading() && this.hasMoreToLoad;
  }

  private async fetchPhotos() {
    this.isLoading.set(true);
    const result = await firstValueFrom(
      this.photoApiService.searchPhoto({
        rendering: {
          size: this.size,
          from: this.from,
        },
      })
    );
    this.isLoading.set(false);
    if (result instanceof Error) {
      console.error('error', result);
      return;
    }
    return result;
  }

  private updatePhotos(photosToAdd: IPhoto[]): void {
    const photos = this.photos$.getValue().concat(photosToAdd);
    this.photos$.next(photos);
  }
}
