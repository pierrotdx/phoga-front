import {
  provideRouter,
  Route,
  ROUTES,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { HomePageComponent, LoginPageComponent } from '../pages';
import { authGuard, Scope } from '@back-office/auth-context';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  IEndpoints,
} from '@back-office/endpoints-context';
import { inject, Provider } from '@angular/core';
import { getAdminPhotoRoute } from './photo.router';
import { getAdminTagRoute } from './tag.router';

const routesFactory = (): Routes => {
  const endpoints = inject(ENDPOINTS_TOKEN);
  const routes: Routes = [
    getRestrictedRoute(endpoints),
    {
      path: endpoints.getRelativePath(EndpointId.LoginPage),
      loadComponent: () => LoginPageComponent,
    },
    { path: '**', component: LoginPageComponent },
  ];
  return routes;
};

function getRestrictedRoute(endpoints: IEndpoints): Route {
  const restrictedRouter: Route = {
    path: endpoints.getRelativePath(EndpointId.Restricted),
    canActivate: [authGuard],
    data: { scopes: [Scope.RestrictedRead] },
    loadChildren: () => [
      {
        path: '',
        loadComponent: () => HomePageComponent,
      },
      getAdminPhotoRoute(endpoints),
      getAdminTagRoute(endpoints),
    ],
  };
  return restrictedRouter;
}

const routesProvider: Provider = {
  provide: ROUTES,
  useFactory: routesFactory,
  deps: [ENDPOINTS_TOKEN],
  multi: true,
};

export const RouteProviders = [
  provideRouter([], withComponentInputBinding()),
  routesProvider,
];
