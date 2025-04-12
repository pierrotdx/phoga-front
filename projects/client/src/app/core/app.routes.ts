import { Routes } from '@angular/router';
import { AppComponent } from '../adapters/primary/app-component/app.component';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () => AppComponent,
  },
];
