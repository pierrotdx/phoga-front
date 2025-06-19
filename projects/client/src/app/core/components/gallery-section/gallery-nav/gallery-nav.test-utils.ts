import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GalleryNavComponent } from './gallery-nav.component';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { ReplaySubject, Subject } from 'rxjs';
import {
  DefaultGalleryId,
  Gallery,
  GalleryService,
  IGallery,
  IGalleryService,
} from '@shared/photo-context';

export const noTagNavItemId = 'no-tag-nav-item';

export class GalleryNavTestUtils {
  private testedComponent!: GalleryNavComponent;
  private fixture!: ComponentFixture<GalleryNavComponent>;

  readonly galleries: IGallery[] = [
    new Gallery(undefined as any, DefaultGalleryId, {
      name: 'default gallery',
    }),
    new Gallery(undefined as any, 'gallery-id-1', { name: 'gallery 1' }),
    new Gallery(undefined as any, 'gallery-id-2', { name: 'gallery 2' }),
  ];

  private readonly selectedGallery$ = new Subject<IGallery | undefined>();
  private readonly fakeSelectGallery = (id: IGallery['_id']) => {
    const selectedGallery = this.galleries.find((g) => g._id === id);
    this.selectedGallery$.next(selectedGallery);
  };

  private readonly fakeGalleryService = jasmine.createSpyObj<IGalleryService>(
    'GalleryService',
    {
      getAll: this.galleries,
      select: undefined,
    },
    { selectedGallery$: this.selectedGallery$.asObservable() }
  );

  private readonly fakeBreakpointState$ = new ReplaySubject<BreakpointState>(1);
  private readonly fakeBreakpointObserver =
    jasmine.createSpyObj<BreakpointObserver>({
      observe: this.fakeBreakpointState$.asObservable(),
    });

  private selectedTagOutputSpy!: jasmine.Spy;

  async globalBeforeEach(): Promise<void> {
    this.fakeGalleryService.select.and.callFake(this.fakeSelectGallery);
    this.simulateBreakpointState(Breakpoints.XSmall);
    this.configureTestBed();
    await TestBed.compileComponents();
    await this.onComponentsCompilation();
  }

  simulateBreakpointState(breakpoint: string): void {
    const state: BreakpointState = {
      matches: true,
      breakpoints: {
        [breakpoint]: true,
      },
    };
    this.fakeBreakpointState$.next(state);
  }

  private configureTestBed(): void {
    TestBed.configureTestingModule({
      imports: [GalleryNavComponent],
      providers: [
        {
          provide: GalleryService,
          useValue: this.fakeGalleryService,
        },
        {
          provide: BreakpointObserver,
          useValue: this.fakeBreakpointObserver,
        },
      ],
    });
  }

  private async onComponentsCompilation(): Promise<void> {
    this.fixture = TestBed.createComponent(GalleryNavComponent);
    this.testedComponent = this.fixture.componentInstance;

    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  getTestedComponent(): GalleryNavComponent {
    return this.testedComponent;
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  getGalleryNav(): DebugElement {
    return this.getDebugElement('.gallery-nav__nav');
  }

  private getDebugElement(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }

  getNavMenuTrigger(): DebugElement {
    return this.getDebugElement('.gallery-nav__nav-menu-trigger');
  }

  expectNavItemToBeDisplayed(galleryId: IGallery['_id']): void {
    const navItem = this.getNavItem(galleryId);
    expect(navItem).toBeTruthy();
  }

  private getNavItem(galleryId: IGallery['_id']): DebugElement | undefined {
    const tagItem = this.getNavItems().find(
      (item) => (item.nativeElement as HTMLElement).id === galleryId
    );
    return tagItem;
  }

  private getNavItems(): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css('.gallery-nav__nav-item'));
  }

  getNoTagNavItem(): DebugElement | undefined {
    return this.getNavItems().find(
      (item) => (item.nativeElement as HTMLElement).id === noTagNavItemId
    );
  }

  expectSelectedNavItemToBe(navItemId: string): void {
    const item: DebugElement | undefined =
      navItemId === noTagNavItemId
        ? this.getNoTagNavItem()
        : this.getNavItem(navItemId);
    const selectedItem = this.getSelectedItem() || undefined;
    expect(item).toEqual(selectedItem);
  }

  private getSelectedItem(): DebugElement | undefined {
    const selectedClass = 'gallery-nav--selected';
    const selectedItem = this.getNavItems().find((item) =>
      (item.nativeElement as HTMLElement).classList.contains(selectedClass)
    );
    return selectedItem;
  }

  clickOnNavItem(navItemId: string): void {
    const item: DebugElement | undefined =
      navItemId === noTagNavItemId
        ? this.getNoTagNavItem()
        : this.getNavItem(navItemId);

    (item?.nativeElement as HTMLElement).click();

    tick();
  }

  getNoSelectionPlaceHolder(): string {
    return this.testedComponent.noSelectionPlaceHolder;
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  displayNavMenu(): void {
    this.testedComponent.expandPanel.set(true);
    this.detectChanges();
  }

  getSelectGallerySpy() {
    return this.fakeGalleryService.select;
  }
}
