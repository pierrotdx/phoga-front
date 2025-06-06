import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { GallerySectionComponent } from './gallery-section.component';
import {
  GalleryService,
  ISearchPhotoFilter,
  PhotoApiService,
} from '@shared/photo-context';
import { of } from 'rxjs';
import { Component, Provider } from '@angular/core';
import { SectionComponent } from '../section/section.component';
import { By } from '@angular/platform-browser';
import { GalleryComponent } from '../../../../photo-context';

@Component({
  template: '',
  selector: 'app-gallery-nav',
})
class GalleryNavStubComponent {}

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

  private readonly photoLoaderSpy = this.fakePhotoApiService.searchPhoto;

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
          GalleryComponent,
          SectionComponent,
          GalleryNavStubComponent,
        ],
        providers: [GalleryService, this.photoApiServiceProvider],
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

  expectGalleryNavigationToBeDisplayed(): void {
    const galleryNavigation = this.fixture.debugElement.query(
      By.css('app-gallery-nav')
    );
    expect(galleryNavigation).toBeTruthy();
  }

  expectPhotosLoaderToHaveBeenCalledWithFilter(
    expectedFilter: ISearchPhotoFilter | undefined
  ): void {
    expect(this.photoLoaderSpy).toHaveBeenCalled();
    const filter = this.photoLoaderSpy.calls.mostRecent().args[0]?.filter;
    expect(filter).toEqual(expectedFilter);
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }
}
