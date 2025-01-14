import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  readonly addPhotoUrl: string;

  readonly restrictedUrl: string;

  constructor(@Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints) {
    this.restrictedUrl = this.endpoints.getFullPath(EndpointId.Restricted);
    this.addPhotoUrl = this.endpoints.getFullPath(EndpointId.AddPhoto);
  }
}
