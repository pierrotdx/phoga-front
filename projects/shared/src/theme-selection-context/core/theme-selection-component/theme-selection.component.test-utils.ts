import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSelectionComponent } from './theme-selection.component';
import { DebugElement, Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IThemeSelectionService, Theme } from '../models';
import { ThemeSelectionService } from '@shared/public-api';

export class ThemeSelectionComponentTestUtils {
  private testedComponent!: ThemeSelectionComponent;
  private fixture!: ComponentFixture<ThemeSelectionComponent>;

  private readonly defaultThemeSelectionServieTheme = Theme.Dark;
  private fakeTheme: Theme = this.defaultThemeSelectionServieTheme;
  private readonly fakeThemeSelectionService =
    jasmine.createSpyObj<IThemeSelectionService>('ThemeSelectionService', {
      select: undefined,
      getTheme: this.fakeTheme,
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

  getForm(): DebugElement {
    const selector = '.select-theme__form';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getFormOption(value: Theme): DebugElement {
    return this.fixture.debugElement.query(
      (elt) => elt.attributes['value'] === value
    );
  }

  getSelect(): DebugElement {
    const selector = '.select-theme__select';
    return this.fixture.debugElement.query(By.css(selector));
  }

  getSelectSpy(): jasmine.Spy {
    return this.fakeThemeSelectionService.select;
  }

  getDefaultThemeSelectionServieTheme(): Theme {
    return this.defaultThemeSelectionServieTheme;
  }
}
