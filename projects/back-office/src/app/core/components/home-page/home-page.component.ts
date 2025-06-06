import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { PhotoItemComponent } from '../../../../photo-context';

@Component({
  selector: 'app-home-page',
  imports: [MatProgressSpinnerModule, PhotoItemComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  photos$ = signal<IPhoto[] | undefined>(undefined);

  constructor(private readonly photoApiService: PhotoApiService) {}

  ngOnInit(): void {
    void this.loadPhotos();
  }

  private async loadPhotos() {
    const searchResult = await firstValueFrom(
      this.photoApiService.searchPhoto()
    );
    if (searchResult instanceof Error) {
      return;
    }
    this.photos$.set(searchResult.hits);
  }
}
