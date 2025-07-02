import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryPreviewComponent } from './gallery-preview.component';
import {
  GalleryService,
  IGallery,
  IGalleryPhotos,
  IGalleryService,
} from '@shared/photo-context';
import { ReplaySubject } from 'rxjs';
import { DebugElement, Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

export class GalleryPreviewComponentTestUtils {
  private testedComponent!: GalleryPreviewComponent;
  private fixture!: ComponentFixture<GalleryPreviewComponent>;

  private readonly galleryPhotos$ = new ReplaySubject<IGalleryPhotos>(1);

  private readonly fakeGalleryService = jasmine.createSpyObj<IGalleryService>(
    'GalleryService',
    ['select']
  );
  private readonly galleryServiceProvider: Provider = {
    provide: GalleryService,
    useValue: this.fakeGalleryService,
  };

  readonly dumbGalleryId = 'dumb gallery';

  private readonly dumbGallery = jasmine.createSpyObj<IGallery>('Gallery', [], {
    _id: this.dumbGalleryId,
    name: 'dumb gallery',
    galleryPhotos$: this.galleryPhotos$.asObservable(),
  });

  readonly fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [GalleryPreviewComponent],
      providers: [
        this.galleryServiceProvider,
        { provide: Router, useValue: this.fakeRouter },
      ],
    }).compileComponents();
    this.fixture = TestBed.createComponent(GalleryPreviewComponent);
    this.onTestedComponentCreation();
  }

  private onTestedComponentCreation(): void {
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.componentRef.setInput('gallery', this.dumbGallery);
  }

  getTestedComponent(): GalleryPreviewComponent {
    return this.testedComponent;
  }

  getFixture(): ComponentFixture<GalleryPreviewComponent> {
    return this.fixture;
  }

  fakeGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.galleryPhotos$.next(galleryPhotos);
  }

  getGalleryPreviewLink(): DebugElement {
    const selector = '.gallery-preview__redirect';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getCarousel(): DebugElement {
    const selector = '.gallery-preview__carousel';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getCarouselSlides(): DebugElement[] {
    const selector = '.gallery-preview__carousel-slide';
    return this.fixture.debugElement.queryAll(By.css(selector));
  }

  getSelectSpy(): jasmine.Spy {
    return this.fakeGalleryService.select;
  }

  getNavigateSpy(): jasmine.Spy {
    return this.fakeRouter.navigate;
  }
}
