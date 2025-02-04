import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoFullscreenComponent } from './photo-fullscreen.component';

describe('PhotoFullscreenComponent', () => {
  let component: PhotoFullscreenComponent;
  let fixture: ComponentFixture<PhotoFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoFullscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
