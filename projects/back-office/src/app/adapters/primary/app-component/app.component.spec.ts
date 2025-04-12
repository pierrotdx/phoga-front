import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthProviderFake } from '../../../../auth-context';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [AuthProviderFake],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
