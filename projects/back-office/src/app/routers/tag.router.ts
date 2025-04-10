import { Route } from '@angular/router';
import { Scope, authGuard } from '@back-office/auth-context';
import { IEndpoints, EndpointId } from '@back-office/endpoints-context';
import { EditTagComponent } from '../components/edit-tag/edit-tag.component';

export function getAdminTagRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AdminTag),
    data: { scopes: [Scope.TagsRead] },
    canActivate: [authGuard],
    loadChildren: () => [
      getEditTagRoute(endpoints),
      getAddTagRoute(endpoints),
    ],
  };
}

function getEditTagRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.EditTag),
    loadComponent: () => EditTagComponent,
    canActivate: [authGuard],
    data: { scopes: [Scope.TagsWrite] },
  };
}

function getAddTagRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AddTag),
    loadComponent: () => EditTagComponent,
    canActivate: [authGuard],
    data: { scopes: [Scope.TagsWrite] },
  };
}
