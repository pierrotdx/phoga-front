import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoStripComponent } from './photo-strip.component';

describe('PhotosStripComponent', () => {
  let component: PhotoStripComponent;
  let fixture: ComponentFixture<PhotoStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoStripComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
