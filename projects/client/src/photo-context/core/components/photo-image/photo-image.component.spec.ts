import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoImageComponent } from './photo-image.component';
import { Photo } from '@shared/photo-context';

describe('PhotoImageComponent', () => {
  let component: PhotoImageComponent;
  let fixture: ComponentFixture<PhotoImageComponent>;
  const photo = new Photo('dumb-photo');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoImageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('photo', photo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
