import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GallerySectionComponent } from './gallery-section.component';
import { Component, input, Input } from '@angular/core';
import { IPhoto, PhotoApiService } from '@shared/photo-context';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';

@Component({
  template: '',
  selector: 'app-photo-collage',
})
class PhotoCollageDumpComponent {
  photos = input<any>();
}

@Component({
  template: '',
  selector: 'app-section',
})
class SectionStubComponent {}

describe('GalleryComponent', () => {
  let component: GallerySectionComponent;
  let fixture: ComponentFixture<GallerySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GallerySectionComponent],
      providers: [
        {
          provide: PhotoApiService,
          useValue: {},
        },
      ],
    })
      .overrideComponent(GallerySectionComponent, {
        set: {
          imports: [
            PhotoCollageDumpComponent,
            AsyncPipe,
            MatProgressSpinnerModule,
            SectionStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GallerySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
