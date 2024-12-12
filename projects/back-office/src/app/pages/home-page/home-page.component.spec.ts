import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { PhotoApiService } from '@shared/photo-context';
import { ENVIRONMENT_TOKEN } from '@back-office/environment-context';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: { phogaApiUrl: 'toto' },
        },
        {
          provide: PhotoApiService,
          deps: [ENVIRONMENT_TOKEN],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
