import { Component, DebugElement, input, model } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { OverlayMatIconBtnComponent } from '@shared/overlay-context';
import {
  IGallery,
  IGalleryPhotos,
  IPhoto,
  IPhotoMetadata,
  ISelectedPhoto,
} from '@shared/photo-context';
import { PhotoDetailedViewComponent } from './photo-detailed-view.component';

import { ReplaySubject } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-photo-selection',
  template: '',
})
export class PhotoSelectionStubComponent {
  gallery = input.required<IGallery>();
  selectNextPhoto$ = input<void>();
  selectPreviousPhoto$ = input<void>();
}

@Component({
  selector: 'app-photo-metadata',
  template: '',
})
export class PhotoMetadataStubComponent {
  photoMetadata = input<IPhotoMetadata>();
}

@Component({
  selector: 'app-photo-image',
  template: '',
})
export class PhotoImageStubComponent {
  photo = input<IPhoto>();
}

@Component({
  selector: 'app-photo-fullscreen',
  template: '',
})
export class PhotoFullscreenStubComponent {
  show = model<boolean>();
  photo = input<IPhoto>();
}

export class PhotoDetailedViewComponentTestUtils {
  private testedComponent!: PhotoDetailedViewComponent;
  private fixture!: ComponentFixture<PhotoDetailedViewComponent>;

  private readonly fakeGalleryPhotos$ = new ReplaySubject<IGalleryPhotos>(1);
  private readonly fakeSelectedPhoto$ = new ReplaySubject<ISelectedPhoto>(1);

  private readonly fakeGallery = jasmine.createSpyObj<IGallery>(
    'Gallery',
    ['selectPhoto'],
    {
      galleryPhotos$: this.fakeGalleryPhotos$.asObservable(),
      selectedPhoto$: this.fakeSelectedPhoto$.asObservable(),
    }
  );

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailedViewComponent],
    })
      .overrideComponent(PhotoDetailedViewComponent, {
        set: {
          imports: [
            PhotoImageStubComponent,
            OverlayMatIconBtnComponent,
            PhotoMetadataStubComponent,
            PhotoSelectionStubComponent,
            MaterialIconComponent,
            PhotoFullscreenStubComponent,
          ],
        },
      })
      .compileComponents();
  }

  createComponent(): void {
    this.fixture = TestBed.createComponent(PhotoDetailedViewComponent);
    this.testedComponent = this.fixture.componentInstance;

    this.fixture.componentRef.setInput('gallery', this.fakeGallery);
    this.fixture.detectChanges();
  }

  getTestedComponent(): PhotoDetailedViewComponent {
    return this.testedComponent;
  }

  simulateGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.fakeGalleryPhotos$.next(galleryPhotos);
  }

  selectPhoto(photo: IPhoto): void {
    this.fakeSelectedPhoto$.next(photo);
  }

  expectOnlyNoPhotoPlaceHolderToBeDisplayed(): void {
    const noPhotoPlaceHolder = this.getEltBySelector(
      '.photo-detailed-view__no-photo-placeholder'
    );
    expect(noPhotoPlaceHolder).toBeTruthy();

    const nbDisplayedElements = this.fixture.debugElement.children.length;
    expect(nbDisplayedElements).toBe(1);
  }

  getEltBySelector(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }

  detectChanges(): void {
    this.detectChanges();
  }
}
