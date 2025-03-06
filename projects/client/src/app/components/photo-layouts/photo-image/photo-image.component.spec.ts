import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoImageComponent } from './photo-image.component';

describe('PhotoImageComponent', () => {
  let component: PhotoImageComponent;
  let fixture: ComponentFixture<PhotoImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
