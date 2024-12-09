import { provideRouter, ROUTES, Routes } from '@angular/router';
import { HomePageComponent, LoginPageComponent } from './pages';
import { authGuard } from './auth-context';
import { EndpointId, ENDPOINTS_TOKEN } from './endpoints-context';
import { inject, Provider } from '@angular/core';

const routesFactory = (): Routes => {
  const endpoints = inject(ENDPOINTS_TOKEN);
  const routes: Routes = [
    {
      path: endpoints.getRelativePath(EndpointId.HomePage),
      loadComponent: () => HomePageComponent,
      canActivate: [authGuard],
    },
    {
      path: endpoints.getRelativePath(EndpointId.LoginPage),
      loadComponent: () => LoginPageComponent,
    },
  ];
  return routes;
};

const routesProvider: Provider = {
  provide: ROUTES,
  useFactory: routesFactory,
  deps: [ENDPOINTS_TOKEN],
  multi: true,
};

export const RouteProviders = [
  provideRouter([]), // seems required for `routesProvider` to work
  routesProvider,
];
