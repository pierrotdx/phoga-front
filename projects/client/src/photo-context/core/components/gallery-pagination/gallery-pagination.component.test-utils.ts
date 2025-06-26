import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryPaginationComponent } from './gallery-pagination.component';
import {
  IGallery,
  IGalleryPhotos,
  ISelectedPhoto,
} from '@shared/photo-context';
import { BehaviorSubject } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class GalleryPaginationComponentTestUtils {
  private testedComponent!: GalleryPaginationComponent;
  private fixture!: ComponentFixture<GalleryPaginationComponent>;

  private readonly fakeTotalCount$ = new BehaviorSubject<number | undefined>(
    undefined
  );
  private readonly fakeSelectedPhoto$ = new BehaviorSubject<ISelectedPhoto>(
    undefined
  );
  private readonly fakeGalleryPhotos$ = new BehaviorSubject<IGalleryPhotos>({
    all: [],
    lastBatch: [],
  });

  private readonly fakeGallery = jasmine.createSpyObj<IGallery>('Gallery', [], {
    totalCount$: this.fakeTotalCount$.asObservable(),
    selectedPhoto$: this.fakeSelectedPhoto$.asObservable(),
    galleryPhotos$: this.fakeGalleryPhotos$.asObservable(),
  });

  async globalBeforeEach() {
    await TestBed.configureTestingModule({
      imports: [GalleryPaginationComponent],
    }).compileComponents();
    this.fixture = TestBed.createComponent(GalleryPaginationComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.componentRef.setInput('gallery', this.fakeGallery);
    this.fixture.detectChanges();
  }

  getTestedComponent(): GalleryPaginationComponent {
    return this.testedComponent;
  }

  getTestedComponentElement(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }

  getTotalCountElt(): DebugElement {
    const selector = '.gallery-pagination__total-count';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getSelectedPhotoPositionElt(): DebugElement {
    const selector = '.gallery-pagination__selected-photo-position';
    return this.fixture.debugElement.query(By.css(selector));
  }

  simulateTotalCount(totalCount: number | undefined): void {
    this.fakeTotalCount$.next(totalCount);
  }

  simulateSelectedPhoto(selectedPhoto: ISelectedPhoto): void {
    this.fakeSelectedPhoto$.next(selectedPhoto);
  }

  simulateGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.fakeGalleryPhotos$.next(galleryPhotos);
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }
}
