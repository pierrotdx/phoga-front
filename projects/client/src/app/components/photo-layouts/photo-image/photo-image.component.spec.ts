import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoImageComponent } from './photo-image.component';
import { PHOTO_UTILS_SERVICE_TOKEN } from '@shared/photo-context';

describe('PhotoImageComponent', () => {
  let component: PhotoImageComponent;
  let fixture: ComponentFixture<PhotoImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoImageComponent],
      providers: [
        {
          provide: PHOTO_UTILS_SERVICE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
