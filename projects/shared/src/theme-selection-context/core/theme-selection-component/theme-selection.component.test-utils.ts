import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSelectionComponent } from './theme-selection.component';
import { DebugElement, Provider, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IThemeSelectionService, Theme } from '../models';
import { ThemeSelectionService } from '@shared/public-api';

export class ThemeSelectionComponentTestUtils {
  private testedComponent!: ThemeSelectionComponent;
  private fixture!: ComponentFixture<ThemeSelectionComponent>;

  private readonly defaultThemeSelectionServieTheme = Theme.Dark;
  private readonly fakeTheme = signal<Theme>(this.defaultThemeSelectionServieTheme);
  private readonly fakeThemeSelectionService =
    jasmine.createSpyObj<IThemeSelectionService>('ThemeSelectionService', [], {
      theme: this.fakeTheme,
    });
  private readonly themeSelectionServiceProvider: Provider = {
    provide: ThemeSelectionService,
    useValue: this.fakeThemeSelectionService,
  };

  async globalBeforeEach() {
    await TestBed.configureTestingModule({
      imports: [ThemeSelectionComponent],
      providers: [this.themeSelectionServiceProvider],
    }).compileComponents();

    this.fixture = TestBed.createComponent(ThemeSelectionComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.detectChanges();
  }

  getTestedComponent(): ThemeSelectionComponent {
    return this.testedComponent;
  }

  getServiceTheme(): Theme {
    return this.fakeThemeSelectionService.theme();
  }

  getServiceThemeSpy(): jasmine.Spy {
    return spyOn(this.fakeThemeSelectionService.theme, 'set');
  }

  getDefaultThemeSelectionServieTheme(): Theme {
    return this.defaultThemeSelectionServieTheme;
  }

  getThemeButton(): DebugElement {
    const selector = '.theme-selection__btn';
    return this.fixture.debugElement.query(By.css(selector));
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  async whenStable(): Promise<void> {
    await this.fixture.whenStable();
  }
}
