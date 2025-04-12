import { Component } from '@angular/core';
import {
  AboutSectionComponent,
  FooterComponent,
  GallerySectionComponent,
  HeaderComponent,
} from '../../../core';

@Component({
  selector: 'app-root',
  imports: [
    AboutSectionComponent,
    FooterComponent,
    HeaderComponent,
    GallerySectionComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
