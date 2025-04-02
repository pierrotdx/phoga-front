import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetailedViewComponent } from './photo-detailed-view.component';
import { PhotoSelectionComponent } from '../photo-selection/photo-selection.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { PhotoImageComponent } from '../photo-image/photo-image.component';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { MaterialIconComponent } from '@shared/material-icon-component';
import { OverlayMatIconBtnComponent } from '../../utils';
import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-photo-selection',
  template: '',
})
export class PhotoSelectionStubComponent {
  selectNextPhoto$ = input<any>();
  selectPreviousPhoto$ = input<any>();
}

@Component({
  selector: 'app-photo-metadata',
  template: '',
})
export class PhotoMetadataStubComponent {
  photoMetadata = input<any>();
}

@Component({
  selector: 'app-photo-image',
  template: '',
})
export class PhotoImageStubComponent {
  photo = input<any>();
}

@Component({
  selector: 'app-photo-fullscreen',
  template: '',
})
export class PhotoFullscreenStubComponent {
  show = model<boolean>();
  imageBuffer = input<any>();
}

describe('PhotoDetailedViewComponent', () => {
  let component: PhotoDetailedViewComponent;
  let fixture: ComponentFixture<PhotoDetailedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhotoDetailedViewComponent,
        PhotoSelectionComponent,
        PhotoMetadataComponent,
        PhotoImageComponent,
        PhotoFullscreenComponent,
        MaterialIconComponent,
        OverlayMatIconBtnComponent,
      ],
    })
      .overrideComponent(PhotoDetailedViewComponent, {
        set: {
          imports: [
            PhotoSelectionStubComponent,
            PhotoMetadataStubComponent,
            PhotoImageStubComponent,
            PhotoFullscreenStubComponent,
            MaterialIconComponent,
            OverlayMatIconBtnComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PhotoDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
