import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCardComponent } from './photo-card.component';

import { MaterialIconComponent } from '@shared/material-icon-component';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';
import { GalleryService } from '@client/app/services';
import { Provider } from '@angular/core';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  const fakeGalleryService = jasmine.createSpyObj<GalleryService>(
    'GalleryService',
    ['selectedPhoto$']
  );
  const galleryServiceProvider: Provider = {
    provide: GalleryService,
    useValue: fakeGalleryService,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhotoCardComponent,
        PhotoMetadataComponent,
        MaterialIconComponent,
        PhotoFullscreenComponent,
      ],
      providers: [galleryServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
