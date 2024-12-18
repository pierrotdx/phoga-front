import {
  provideRouter,
  Route,
  ROUTES,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import {
  EditPhotoPageComponent,
  HomePageComponent,
  LoginPageComponent,
} from './pages';
import { authGuard, Scope } from './auth-context';
import { EndpointId, ENDPOINTS_TOKEN, IEndpoints } from './endpoints-context';
import { inject, Provider } from '@angular/core';

const routesFactory = (): Routes => {
  const endpoints = inject(ENDPOINTS_TOKEN);
  const routes: Routes = [
    getRestrictedRoute(endpoints),
    {
      path: endpoints.getRelativePath(EndpointId.LoginPage),
      loadComponent: () => LoginPageComponent,
    },
  ];
  return routes;
};

function getRestrictedRoute(endpoints: IEndpoints): Route {
  const restrictedRouter: Route = {
    path: endpoints.getRelativePath(EndpointId.Restricted),
    canActivate: [authGuard],
    data: { scopes: [Scope.RestrictedRead, Scope.PhotosRead] },
    loadChildren: () => [
      {
        path: '',
        loadComponent: () => HomePageComponent,
      },
      {
        path: endpoints.getRelativePath(EndpointId.EditPage),
        loadComponent: () => EditPhotoPageComponent,
      },
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
