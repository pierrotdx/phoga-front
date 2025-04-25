import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { GalleryService, IGalleryPhotos } from '@client/photo-context';
import { OverlayPanelComponent } from '@shared/overlay-context';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { GallerySectionComponent } from './gallery-section.component';
import { IPhoto } from '@shared/photo-context';
import { BehaviorSubject } from 'rxjs';
import { Component, input } from '@angular/core';
import { SectionComponent } from '../section/section.component';

@Component({
  template: '',
  selector: 'app-photo-collage',
})
class PhotoCollageDumpComponent {
  photos = input<any>();
}

@Component({
  template: '',
  selector: 'app-photo-detailed-view',
})
class PhotoDetailedViewStubComponent {}

export class GallerySectionTestUtils {
  private testedComponent!: GallerySectionComponent;
  private fixture!: ComponentFixture<GallerySectionComponent>;

  private readonly fakeGalleryService = jasmine.createSpyObj<GalleryService>(
    'GalleryService',
    [],
    {
      photos$: new BehaviorSubject<IGalleryPhotos>({ all: [], lastBatch: [] }),
      isLoading$: new BehaviorSubject<boolean>(false),
      selectedPhoto$: new BehaviorSubject<IPhoto | undefined>(undefined),
    }
  );

  async globalBeforeEach(): Promise<void> {
    this.configureTestBed();
    await TestBed.compileComponents();
    this.onComponentsCompilation();
  }

  private configureTestBed(): void {
    TestBed.configureTestingModule({
      imports: [GallerySectionComponent],
      providers: [
        {
          provide: GalleryService,
          useValue: this.fakeGalleryService,
        },
      ],
    }).overrideComponent(GallerySectionComponent, {
      set: {
        imports: [
          AsyncPipe,
          PhotoCollageDumpComponent,
          InfiniteScrollDirective,
          MatProgressSpinner,
          PhotoDetailedViewStubComponent,
          OverlayPanelComponent,
          SectionComponent,
        ],
      },
    });
  }

  private onComponentsCompilation(): void {
    this.fixture = TestBed.createComponent(GallerySectionComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.autoDetectChanges();
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }
}
