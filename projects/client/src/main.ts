import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, AppComponent } from './app';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
