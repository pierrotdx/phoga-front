import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';
import { Component, Input } from '@angular/core';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  template: '',
  selector: 'app-collage',
})
class CollageDumpComponent {
  @Input() photos: IPhoto[] | undefined;
}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [
        {
          provide: PhotoApiService,
          useValue: {},
        },
      ],
    })
      .overrideComponent(GalleryComponent, {
        set: {
          imports: [CollageDumpComponent, AsyncPipe, MatProgressSpinnerModule],
        },
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
