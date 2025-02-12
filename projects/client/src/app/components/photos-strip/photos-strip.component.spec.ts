import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosStripComponent } from './photos-strip.component';

describe('PhotosStripComponent', () => {
  let component: PhotosStripComponent;
  let fixture: ComponentFixture<PhotosStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
