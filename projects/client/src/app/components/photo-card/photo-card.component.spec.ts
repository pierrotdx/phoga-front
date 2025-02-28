import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCardComponent } from './photo-card.component';
import { AsyncPipe } from '@angular/common';
import { MaterialIconComponent } from '@shared/material-icon';
import { BufferToImagePipe } from '@shared/pipes';
import { PhotoFullscreenComponent } from '../photo-fullscreen/photo-fullscreen.component';
import { PhotoMetadataComponent } from '../photo-metadata/photo-metadata.component';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhotoCardComponent,
        BufferToImagePipe,
        AsyncPipe,
        PhotoMetadataComponent,
        MaterialIconComponent,
        PhotoFullscreenComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
