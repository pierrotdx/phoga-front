import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard } from './auth-context';
import { HomePageRoute, LoginPageRoute } from './routes-context';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: LoginPageRoute.getRelativePath(),
    component: LoginPageComponent,
  },
  {
    path: HomePageRoute.getRelativePath(),
    component: HomePageComponent,
    canActivate: [authGuard],
  },
];
