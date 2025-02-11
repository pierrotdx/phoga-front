import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({})
      .overrideComponent(AppComponent, {
        set: {
          imports: [FooterStubComponent, HeaderStubComponent, RouterOutlet],
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
