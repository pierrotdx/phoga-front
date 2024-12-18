import { AsyncPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BufferToImagePipe } from '@shared/pipes';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, BufferToImagePipe, MatProgressSpinnerModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  photos$ = signal<IPhoto[] | undefined>(undefined);

  constructor(private readonly photoApiService: PhotoApiService) {}

  ngOnInit(): void {
    void this.searchPhoto();
  }

  private async searchPhoto() {
    const photos = await firstValueFrom(
      this.photoApiService.searchPhoto({ excludeImages: true })
    );
    if (photos instanceof Error) {
      return;
    }
    this.photos$.set(photos);
  }
}
