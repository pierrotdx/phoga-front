import { Routes } from '@angular/router';
import { AboutComponent, GalleryComponent } from './pages';

export const routes: Routes = [
  {
    path: 'about',
    loadComponent: () => AboutComponent,
  },
  {
    path: 'gallery',
    loadComponent: () => GalleryComponent,
  },
  {
    path: '**',
    loadComponent: () => GalleryComponent,
  },
];
