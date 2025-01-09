import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { EndpointsProvider } from '@back-office/app/endpoints-context';
import {
  IPhoto,
  ISearchPhotoOptions,
  PhotoApiService,
} from '@shared/photo-context';
import { HomePageComponent } from './home-page.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { from, Observable, of } from 'rxjs';

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
      imports: [HomePageComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: PhotoApiService,
          useValue: this.photoApiServiceMock,
        },
        EndpointsProvider,
      ],
    }).compileComponents();

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
