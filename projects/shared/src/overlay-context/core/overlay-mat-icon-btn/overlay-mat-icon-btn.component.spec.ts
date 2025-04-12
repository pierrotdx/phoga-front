import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayMatIconBtnComponent } from './overlay-mat-icon-btn.component';

describe('OverlayMatIconBtnComponent', () => {
  let component: OverlayMatIconBtnComponent;
  let fixture: ComponentFixture<OverlayMatIconBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayMatIconBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayMatIconBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
