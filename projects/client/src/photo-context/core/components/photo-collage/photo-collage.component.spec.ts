import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCollageComponent } from './photo-collage.component';

describe('CollageComponent', () => {
  let component: PhotoCollageComponent;
  let fixture: ComponentFixture<PhotoCollageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCollageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCollageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
