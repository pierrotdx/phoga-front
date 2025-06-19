import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { GallerySectionComponent } from './gallery-section.component';
import {
  GalleryService,
  IGallery,
  IGalleryService,
  ISearchPhotoFilter,
  PhotoApiService,
} from '@shared/photo-context';
import { of, Subject } from 'rxjs';
import { Component, DebugElement, input, Provider } from '@angular/core';
import { SectionComponent } from '../section/section.component';
import { By } from '@angular/platform-browser';
import { GalleryComponent } from '../../../../photo-context';

@Component({
  template: '',
  selector: 'app-gallery-nav',
})
class GalleryNavStubComponent {}

@Component({
  template: '',
  selector: 'lib-gallery',
})
class GalleryStubComponent {
  gallery = input<IGallery>();
}

export class GallerySectionTestUtils {
  private testedComponent!: GallerySectionComponent;
  private fixture!: ComponentFixture<GallerySectionComponent>;

  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    { searchPhoto: of({ hits: [], totalCount: 0 }) }
  );
  private readonly photoApiServiceProvider: Provider = {
    provide: PhotoApiService,
    useValue: this.fakePhotoApiService,
  };

  private readonly fakeGalleryService = jasmine.createSpyObj<IGalleryService>(
    'GalleryService',
    ['create', 'select'],
    { selectedGallery$: new Subject<IGallery | undefined>().asObservable() }
  );
  private readonly galleryServiceProvider: Provider = {
    provide: GalleryService,
    useValue: this.fakeGalleryService,
  };

  async globalBeforeEach(): Promise<void> {
    this.configureTestBed();
    await TestBed.compileComponents();
    this.onComponentsCompilation();
  }

  private configureTestBed(): void {
    TestBed.configureTestingModule({
      imports: [GallerySectionComponent],
    }).overrideComponent(GallerySectionComponent, {
      set: {
        imports: [
          InfiniteScrollDirective,
          GalleryStubComponent,
          SectionComponent,
          GalleryNavStubComponent,
        ],
        providers: [this.galleryServiceProvider, this.photoApiServiceProvider],
      },
    });
  }

  private onComponentsCompilation(): void {
    this.fixture = TestBed.createComponent(GallerySectionComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.autoDetectChanges();
  }

  getTestedComponent(): GallerySectionComponent {
    return this.testedComponent;
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  queryByCss(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }
}
