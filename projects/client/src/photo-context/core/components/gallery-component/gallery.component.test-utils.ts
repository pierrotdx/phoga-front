import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { IGalleryPhotos, IGallery, IPhotoStrip } from '@shared/public-api';

export class GalleryComponentTestUtils {
  private testedComponent!: GalleryComponent;
  private fixture!: ComponentFixture<GalleryComponent>;

  private readonly fakeIsLoading$ = new ReplaySubject<boolean>(1);
  private readonly fakeGalleryPhotos$ = new ReplaySubject<IGalleryPhotos>();
  private readonly fakeGallery = jasmine.createSpyObj<IGallery>('Gallery', [], {
    isLoading$: this.fakeIsLoading$.asObservable(),
    galleryPhotos$: this.fakeGalleryPhotos$.asObservable(),
  });

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
    }).compileComponents();
  }

  createComponent(): void {
    this.fixture = TestBed.createComponent(GalleryComponent);
    this.testedComponent = this.fixture.componentInstance;

    this.fixture.componentRef.setInput('gallery', this.fakeGallery);

    this.fixture.detectChanges();
  }

  getTestedComponent(): GalleryComponent {
    return this.testedComponent;
  }

  expectOnlyLoadingPlaceHolderToBeDisplayed(): void {
    const loadingPlaceHolder = this.getLoadingPlaceHolder();
    expect(loadingPlaceHolder).toBeTruthy();

    const nbDisplayedElements = this.fixture.debugElement.children.length;
    expect(nbDisplayedElements).toBe(1);
  }

  getLoadingPlaceHolder(): DebugElement {
    const className = 'gallery__loading-placeholder';
    return this.getElementByClass(className);
  }

  private getElementByClass(className: string): DebugElement {
    return this.fixture.debugElement.query(By.css(`.${className}`));
  }

  getEmptyGalleryPlaceHolder(): DebugElement {
    const className = 'gallery__empty-gallery-placeholder';
    return this.getElementByClass(className);
  }

  simulateGalleryLoading(loadingStatus: boolean): void {
    this.fakeIsLoading$.next(loadingStatus);
  }

  simulateGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.fakeGalleryPhotos$.next(galleryPhotos);
  }

  getPhotoStrips(): IPhotoStrip[] {
    return this.testedComponent.photoStrips();
  }

  getPhotoStripCompElements(): DebugElement[] {
    const selector = 'app-photo-strip';
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}
