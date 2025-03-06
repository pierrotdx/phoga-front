import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';
import { Component, Input } from '@angular/core';
import {
  IPhoto,
  PHOTO_SELECTOR_SERVICE_TOKEN,
  PhotoApiService,
} from '@shared/photo-context';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
  selector: 'app-photo-collage',
})
class PhotoCollageDumpComponent {
  @Input() photos: IPhoto[] | undefined;
}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [
        {
          provide: PhotoApiService,
          useValue: {},
        },
        {
          provide: PHOTO_SELECTOR_SERVICE_TOKEN,
          useValue: {
            selectedPhoto: new BehaviorSubject<IPhoto | undefined>(undefined),
          },
        },
      ],
    })
      .overrideComponent(GalleryComponent, {
        set: {
          imports: [
            PhotoCollageDumpComponent,
            AsyncPipe,
            MatProgressSpinnerModule,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
