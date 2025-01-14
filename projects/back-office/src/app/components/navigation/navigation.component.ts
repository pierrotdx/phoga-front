import { Component, Inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthComponent } from '@back-office/auth-context';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, AuthComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  isAuthenticated = signal<boolean>(false);

  readonly restrictedUrl: string;

  constructor(@Inject(ENDPOINTS_TOKEN) private readonly endpoints: IEndpoints) {
    this.restrictedUrl = this.endpoints.getRelativePath(EndpointId.Restricted);
  }
}
