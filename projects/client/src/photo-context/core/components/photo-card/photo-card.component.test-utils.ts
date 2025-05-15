import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { PhotoFullscreenComponent } from '..';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { Component, DebugElement, input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  IGallery,
  IGalleryPhotos,
  IPhoto,
  IPhotoMetadata,
} from '@shared/photo-context';
import { ReplaySubject, Subject } from 'rxjs';
import {
  OverlayMatIconBtnComponent,
  OverlayPanelComponent,
} from '@shared/overlay-context';

@Component({
  selector: 'app-photo-image',
  template: '',
})
export class PhotoImageStubComponent {
  photo = input<IPhoto>();
}

@Component({
  selector: 'app-photo-metadata',
  template: '',
})
export class PhotoMetadataStubComponent {
  photoMetadata = input<IPhotoMetadata>();
}

const fakeCloseDetailedView = new Subject<void>();

@Component({
  selector: 'app-photo-detailed-view',
  template: '',
})
export class PhotoDetailedViewStubComponent {
  gallery = input<IGallery>();
  photo = input<IPhoto>();
  @Output() close = fakeCloseDetailedView;
}

export class PhotoCardComponentTestUtils {
  private fixture!: ComponentFixture<PhotoCardComponent>;
  private testedComponent!: PhotoCardComponent;

  private readonly fakeGalleryPhotos = new ReplaySubject<IGalleryPhotos>(1);
  private readonly fakeGallery = jasmine.createSpyObj<IGallery>(
    'Gallery',
    ['selectPhoto', 'deselectPhoto'],
    {
      galleryPhotos$: this.fakeGalleryPhotos,
    }
  );
  private fakePhotoId: string | undefined;

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    })
      .overrideComponent(PhotoCardComponent, {
        set: {
          imports: [
            PhotoMetadataStubComponent,
            OverlayMatIconBtnComponent,
            OverlayPanelComponent,
            MaterialIconComponent,
            PhotoFullscreenComponent,
            PhotoImageStubComponent,
            PhotoDetailedViewStubComponent,
          ],
        },
      })
      .compileComponents();
  }

  async createComponent(): Promise<void> {
    this.fixture = TestBed.createComponent(PhotoCardComponent);
    this.testedComponent = this.fixture.componentInstance;

    this.fixture.componentRef.setInput('gallery', this.fakeGallery);
    this.fixture.componentRef.setInput('photoId', this.fakePhotoId);
    this.fixture.detectChanges();
    await this.fixture.whenStable();

    this.fixture.detectChanges();
  }

  getTestedComponent(): PhotoCardComponent {
    return this.testedComponent;
  }

  getPhotoImageComponent(): DebugElement {
    const selector = 'app-photo-image';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getPhotoMetadataComponent(): DebugElement {
    const selector = 'app-photo-metadata';
    return this.fixture.debugElement.query(By.css(selector));
  }

  simulateGalleryPhotos(galleryPhotos: IGalleryPhotos): void {
    this.fakeGalleryPhotos.next(galleryPhotos);
  }

  simulatePhotoId(id: IPhoto['_id']): void {
    this.fakePhotoId = id;
  }

  clickOnExpandIcon() {
    const selector = '.photo-card__image-btn';
    const expandIconElt = this.fixture.debugElement.query(By.css(selector))
      .nativeElement as HTMLElement;
    expandIconElt.click();
    this.fixture.detectChanges();
  }

  getShowDetailedView(): boolean {
    return this.testedComponent.showDetailedView();
  }

  isDisplayingDetailedView(): boolean {
    const overlaySelector = 'app-overlay-panel';
    const overlayPanel = this.fixture.debugElement.query(
      By.css(overlaySelector)
    );
    const detailedViewCompSelector = 'app-photo-detailed-view';
    const isDisplayingDetailedView = (
      overlayPanel.nativeElement as HTMLElement
    ).innerHTML.includes(detailedViewCompSelector);
    return isDisplayingDetailedView;
  }

  getGallerySelectSpy() {
    return this.fakeGallery.selectPhoto;
  }

  getGalleryDeselectSpy() {
    return this.fakeGallery.deselectPhoto;
  }

  simulateCloseDetailedView() {
    fakeCloseDetailedView.next();
  }
}
