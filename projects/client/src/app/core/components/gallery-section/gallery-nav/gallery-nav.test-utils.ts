import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TagApiService, ITag, ISelectedTag } from '@shared/tag-context';
import { GalleryNavComponent } from './gallery-nav.component';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { ReplaySubject } from 'rxjs';

export const noTagNavItemId = 'no-tag-nav-item';

export class GalleryNavTestUtils {
  private testedComponent!: GalleryNavComponent;
  private fixture!: ComponentFixture<GalleryNavComponent>;

  private readonly fakeTagApiService = jasmine.createSpyObj<TagApiService>(
    'TagApiService',
    ['search']
  );

  private readonly fakeBreakpointState$ = new ReplaySubject<BreakpointState>(1);
  private readonly fakeBreakpointObserver =
    jasmine.createSpyObj<BreakpointObserver>({
      observe: this.fakeBreakpointState$.asObservable(),
    });

  private loadTagsSpy!: jasmine.Spy;
  private selectedTagOutputSpy!: jasmine.Spy;

  async globalBeforeEach(): Promise<void> {
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
          provide: TagApiService,
          useValue: this.fakeTagApiService,
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
    this.setLoadTagsSpy();
    this.setSelectedTagOutputSpy();
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }

  private setLoadTagsSpy(): void {
    this.loadTagsSpy = this.fakeTagApiService.search;
  }

  private setSelectedTagOutputSpy(): void {
    this.selectedTagOutputSpy = spyOn(
      this.testedComponent.selectedTagChange,
      'emit'
    );
  }

  resetCallsOfSelectedTagOutputSpy(): void {
    this.selectedTagOutputSpy.calls.reset();
  }

  getTestedComponent(): GalleryNavComponent {
    return this.testedComponent;
  }

  simulateLoadedTags(tags: ITag[] | Error | undefined): void {
    const payload =
      tags instanceof Error || !tags
        ? tags
        : { hits: tags, totalCount: tags.length };
    this.testedComponent.tagsResource.set(payload);
    this.fixture.detectChanges();
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  expectLoadTagsToHaveBeenCalled(): void {
    expect(this.loadTagsSpy).toHaveBeenCalled();
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

  expectTagNavItemToBeDisplayed(tagId: ITag['_id']): void {
    const tagNavItem = this.getTagNavItem(tagId);
    expect(tagNavItem).toBeTruthy();
  }

  private getTagNavItem(tagId: ITag['_id']): DebugElement | undefined {
    const tagItem = this.getNavItems().find(
      (item) => (item.nativeElement as HTMLElement).id === tagId
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
        : this.getTagNavItem(navItemId);
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
        : this.getTagNavItem(navItemId);

    (item?.nativeElement as HTMLElement).click();

    tick();
  }

  expectSelectedTagOutputToBe(expectedValue: ISelectedTag): void {
    expect(this.selectedTagOutputSpy).toHaveBeenCalledOnceWith(expectedValue);
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
}
