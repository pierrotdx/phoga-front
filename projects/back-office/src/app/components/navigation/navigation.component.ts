import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, MatIconModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  readonly addPhotoUrl: string;
  readonly addTagUrl: string;

  readonly restrictedUrl: string;

  constructor(@Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints) {
    this.restrictedUrl = this.endpoints.getFullPath(EndpointId.Restricted);
    this.addPhotoUrl = this.endpoints.getFullPath(EndpointId.AddPhoto);
    this.addTagUrl = this.endpoints.getFullPath(EndpointId.AddTag);
  }
}
