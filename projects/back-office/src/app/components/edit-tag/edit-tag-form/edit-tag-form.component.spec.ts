import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTagFormComponent } from './edit-tag-form.component';

describe('EditTagFormComponent', () => {
  let component: EditTagFormComponent;
  let fixture: ComponentFixture<EditTagFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTagFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
