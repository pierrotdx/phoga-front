import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IPhoto,
  ISearchPhotoOptions,
  PhotoApiService,
} from '@shared/photo-context';
import { HomePageComponent } from './home-page.component';
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-photo-item',
  template: '',
})
export class PhotoItemStubComponent {}

export class HomePageTestUtils {
  component!: HomePageComponent;

  private fixture!: ComponentFixture<HomePageComponent>;
  private photoApiServiceMock = {
    searchPhoto: (
      options?: ISearchPhotoOptions
    ): Observable<IPhoto[] | undefined> => of([]),
  };

  async globalBeforeEach(): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: PhotoApiService,
          useValue: this.photoApiServiceMock,
        },
      ],
    })
      .overrideComponent(HomePageComponent, {
        set: {
          imports: [PhotoItemStubComponent, MatProgressSpinnerModule],
          schemas: [NO_ERRORS_SCHEMA],
        },
      })
      .compileComponents();

    this.fixture = TestBed.createComponent(HomePageComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  getElementById(id: string): DebugElement {
    const pageElement = this.fixture.debugElement;
    return pageElement.query(By.css(`#${id}`));
  }

  setPhotos(value: IPhoto[] | undefined): void {
    this.component.photos$.set(value);
    this.fixture.detectChanges();
  }
}
