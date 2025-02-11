import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryComponent } from './gallery.component';
import { Component } from '@angular/core';

@Component({
  template: '',
  selector: 'app-collage',
})
class CollageDumpComponent {}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent, CollageDumpComponent],
    })
      .overrideComponent(GalleryComponent, {
        set: { imports: [CollageDumpComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
