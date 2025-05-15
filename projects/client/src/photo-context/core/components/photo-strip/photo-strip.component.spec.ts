import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoStripComponent } from './photo-strip.component';
import { IGallery, IPhotoStrip } from '@shared/photo-context';

describe('PhotosStripComponent', () => {
  let component: PhotoStripComponent;
  let fixture: ComponentFixture<PhotoStripComponent>;
  const fakeGallery = jasmine.createSpyObj<IGallery>('Gallery', [
    'galleryPhotos$',
  ]);
  const fakeStrip: IPhotoStrip = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoStripComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoStripComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('gallery', fakeGallery);
    fixture.componentRef.setInput('strip', fakeStrip);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
