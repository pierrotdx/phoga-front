import { Component } from '@angular/core';
import {
  AboutComponent,
  FooterComponent,
  GalleryComponent,
  HeaderComponent,
} from '../global-layout';

@Component({
  selector: 'app-root',
  imports: [AboutComponent, FooterComponent, HeaderComponent, GalleryComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
