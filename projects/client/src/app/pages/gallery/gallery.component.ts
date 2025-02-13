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
    // one loading at a time
    if (this.isLoading() || !this.hasMoreToLoad) {
      return;
    }
    this.isLoading.set(true);
    const loadingResult = await firstValueFrom(
      this.photoApiService.searchPhoto({
        rendering: {
          size: this.size,
          from: this.from,
        },
      })
    );
    this.isLoading.set(false);
    if (loadingResult instanceof Error) {
      console.error('error', loadingResult);
      return;
    }
    this.from += loadingResult.length;
    this.hasMoreToLoad = loadingResult.length === this.size;
    const photos = this.photos$.getValue().concat(loadingResult);
    this.photos$.next(photos);
  }
}
