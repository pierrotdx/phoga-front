import { Routes } from '@angular/router';
import { AppComponent } from './components';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () => AppComponent,
  },
];
