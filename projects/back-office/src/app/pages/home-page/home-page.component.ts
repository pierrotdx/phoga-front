import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/app/endpoints-context';
import { PhotoItemComponent } from './photo-item/photo-item.component';

@Component({
  selector: 'app-home-page',
  imports: [MatProgressSpinnerModule, RouterLink, PhotoItemComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  photos$ = signal<IPhoto[] | undefined>(undefined);
  private readonly adminPhotoUrl: string;
  readonly addPhotoUrl: string;

  constructor(
    @Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints,
    private readonly photoApiService: PhotoApiService
  ) {
    this.adminPhotoUrl = this.endpoints.getRelativePath(EndpointId.AdminPhoto);
    this.addPhotoUrl = this.getAddPhotoUrl();
  }

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

  private getAddPhotoUrl(): string {
    return `${this.adminPhotoUrl}/${this.endpoints.getRelativePath(
      EndpointId.AddPhoto
    )}`;
  }
}
