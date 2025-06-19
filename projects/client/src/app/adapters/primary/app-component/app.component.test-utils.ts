import { Component, DebugElement, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryService, IGalleryService } from '@shared/photo-context';
import { AppComponent } from './app.component';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

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
  selector: 'app-gallery-section',
  template: '',
})
class GalleryStubComponent {}

@Component({
  selector: 'app-about-section',
  template: '',
})
class AboutStubComponent {}

export class AppComponentTestUtils {
  private testedComponent!: AppComponent;
  private fixture!: ComponentFixture<AppComponent>;

  private readonly fakeGalleryService = jasmine.createSpyObj<IGalleryService>(
    'GalleryService',
    ['initGalleries']
  );
  private readonly galleryServiceProvider: Provider = {
    provide: GalleryService,
    useValue: this.fakeGalleryService,
  };

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
      .overrideComponent(AppComponent, {
        set: {
          imports: [
            AboutStubComponent,
            FooterStubComponent,
            GalleryStubComponent,
            HeaderStubComponent,
            MatProgressSpinner,
          ],
          providers: [this.galleryServiceProvider],
        },
      })
      .compileComponents();
    this.fixture = TestBed.createComponent(AppComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  getTestedComponent(): AppComponent {
    return this.testedComponent;
  }

  getInitGalleryServiceSpy(): jasmine.Spy {
    return this.fakeGalleryService.initGalleries;
  }

  getLoadingPlaceHolder(): DebugElement {
    return this.fixture.debugElement.query(By.css('mat-spinner'));
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }
}
