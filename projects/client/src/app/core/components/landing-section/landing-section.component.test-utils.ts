import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingSectionComponent } from './landing-section.component';
import { DebugElement, Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ITagApiService, TagApiService } from '@shared/tag-context';
import {
  Gallery,
  IGallery,
  ISearchPhotoFilter,
  PhotoApiService,
} from '@shared/photo-context';

export class LandingSectionComponentTestUtils {
  private testedComponent!: LandingSectionComponent;
  private fixture!: ComponentFixture<LandingSectionComponent>;

  private readonly fakeTagApiService = jasmine.createSpyObj<ITagApiService>(
    'TagApiService',
    ['search']
  );
  private readonly tagApiServiceProvider: Provider = {
    provide: TagApiService,
    useValue: this.fakeTagApiService,
  };

  private readonly fakePhotoApiService = jasmine.createSpyObj<PhotoApiService>(
    'PhotoApiService',
    ['searchPhoto']
  );
  private readonly photoApiServiceProvider: Provider = {
    provide: PhotoApiService,
    useValue: this.fakePhotoApiService,
  };

  async globalBeforeEach() {
    await TestBed.configureTestingModule({
      imports: [LandingSectionComponent],
      providers: [this.tagApiServiceProvider, this.photoApiServiceProvider],
    }).compileComponents();
    this.onTestedComponentCompilation();
  }

  private onTestedComponentCompilation(): void {
    this.fixture = TestBed.createComponent(LandingSectionComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  getTestedComponent(): LandingSectionComponent {
    return this.testedComponent;
  }

  getLoadingPlaceHolder(): DebugElement {
    const selector = '.landing-section__loading-placeholder';
    return this.fixture.debugElement.query(By.css(selector));
  }

  async simulateGalleriesFromServer(
    galleries: IGallery[] | undefined
  ): Promise<void> {
    this.testedComponent.galleriesResource.set(galleries);
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  getNoGalleryPlaceHolder(): DebugElement {
    const selector = '.landing-section__no-gallery-placeholder';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getGalleryPreview(): DebugElement[] {
    const selector = 'app-gallery-preview';
    return this.fixture.debugElement.queryAll(By.css(selector));
  }

  createGallery(id: IGallery['_id'], filter?: ISearchPhotoFilter): IGallery {
    return new Gallery(this.fakePhotoApiService, id, { filter });
  }
}
