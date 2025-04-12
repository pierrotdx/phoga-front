import { Route } from '@angular/router';
import { Scope, authGuard } from '@back-office/auth-context';
import { IEndpoints, EndpointId } from '@back-office/endpoints-context';
import { EditTagComponent } from '../components/edit-tag/edit-tag.component';
import { TagsPageComponent } from '../pages/';

export function getAdminTagRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AdminTag),
    data: { scopes: [Scope.TagsRead] },
    canActivate: [authGuard],
    loadChildren: () => [
      getTagsPageRoute(endpoints),
      getEditTagRoute(endpoints),
      getAddTagRoute(endpoints),
    ],
  };
}

function getTagsPageRoute(endpoints: IEndpoints): Route {
  return {
    path: endpoints.getRelativePath(EndpointId.AllTags),
    loadComponent: () => TagsPageComponent,
    canActivate: [authGuard],
    data: { scopes: [Scope.TagsRead] },
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
