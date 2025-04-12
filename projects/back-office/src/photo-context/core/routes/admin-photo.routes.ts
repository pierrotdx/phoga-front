import { Route } from '@angular/router';
import { Scope, authGuard } from '../../../auth-context';
import { IEndpoints, EndpointId } from '../../../endpoints-context';
import { EditPhotoComponent } from '../components/edit-photo/edit-photo.component';

export function getAdminPhotoRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AdminPhoto),
    data: { scopes: [Scope.PhotosRead] },
    canActivate: [authGuard],
    loadChildren: () => [
      getEditPhotoRoute(endpoints),
      getAddPhotoRoute(endpoints),
    ],
  };
}

function getEditPhotoRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.EditPhoto),
    loadComponent: () => EditPhotoComponent,
    canActivate: [authGuard],
    data: { scopes: [Scope.PhotosWrite] },
  };
}

function getAddPhotoRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AddPhoto),
    loadComponent: () => EditPhotoComponent,
    canActivate: [authGuard],
    data: { scopes: [Scope.PhotosWrite] },
  };
}
