import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AboutComponent, GalleryComponent } from '../../pages/';

@Component({
  selector: 'app-root',
  imports: [
    AboutComponent,
    FooterComponent,
    HeaderComponent,
    GalleryComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
