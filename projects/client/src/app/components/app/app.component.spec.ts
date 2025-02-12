import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: '',
})
class FooterStubComponent {}

@Component({
  selector: 'app-footer',
  template: '',
})
class HeaderStubComponent {}

@Component({
  selector: 'app-gallery',
  template: '',
})
class GalleryStubComponent {}

@Component({
  selector: 'app-about',
  template: '',
})
class AboutStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({})
      .overrideComponent(AppComponent, {
        set: {
          imports: [
            AboutStubComponent,
            FooterStubComponent,
            GalleryStubComponent,
            HeaderStubComponent,
          ],
        },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
