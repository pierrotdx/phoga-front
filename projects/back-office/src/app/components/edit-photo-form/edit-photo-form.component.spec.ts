import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoFormComponent } from './edit-photo-form.component';

describe('EditPhotoFormComponent', () => {
  let component: EditPhotoFormComponent;
  let fixture: ComponentFixture<EditPhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhotoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhotoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
