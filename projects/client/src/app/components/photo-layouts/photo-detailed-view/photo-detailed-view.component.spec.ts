import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetailedViewComponent } from './photo-detailed-view.component';
import { PhotoUtilsServiceProvider } from '@shared/photo-context';

describe('PhotoDetailedViewComponent', () => {
  let component: PhotoDetailedViewComponent;
  let fixture: ComponentFixture<PhotoDetailedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailedViewComponent],
      providers: [PhotoUtilsServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
