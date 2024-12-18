import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoPageComponent } from './edit-photo-page.component';
import { PhotoApiService } from '@shared/photo-context';

describe('EditPhotoPageComponent', () => {
  let component: EditPhotoPageComponent;
  let fixture: ComponentFixture<EditPhotoPageComponent>;
  const photoApiServiceProvider = {
    provide: PhotoApiService,
    useValue: {} as PhotoApiService,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhotoPageComponent],
      providers: [photoApiServiceProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPhotoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
