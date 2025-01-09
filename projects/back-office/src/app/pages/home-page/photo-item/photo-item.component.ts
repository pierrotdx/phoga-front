import { AsyncPipe } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/app/endpoints-context';
import { IPhoto } from '@shared/photo-context';
import { BufferToImagePipe } from '@shared/pipes';

@Component({
  selector: 'app-photo-item',
  imports: [AsyncPipe, BufferToImagePipe, RouterModule],
  templateUrl: './photo-item.component.html',
})
export class PhotoItemComponent {
  @Input() photo: IPhoto | undefined;

  readonly editPhotoBaseUrl: string;
  private readonly adminPhotoUrl: string;

  constructor(@Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints) {
    this.adminPhotoUrl = this.endpoints.getRelativePath(EndpointId.AdminPhoto);
    this.editPhotoBaseUrl = this.getEditPhotoBaseUrl();
  }

  private getEditPhotoBaseUrl(): string {
    return `${this.adminPhotoUrl}/edit`;
  }
}
