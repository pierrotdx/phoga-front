import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TagApiService, ITag } from '@shared/tag-context';
import { GalleryNavComponent } from './gallery-nav.component';

export const noTagNavItemId = 'no-tag-nav-item';

export class GalleryNavTestUtils {
  private testedComponent!: GalleryNavComponent;
  private fixture!: ComponentFixture<GalleryNavComponent>;

  private readonly fakeTagApiService = jasmine.createSpyObj<TagApiService>(
    'TagApiService',
    ['search']
  );

  private loadTagsSpy!: jasmine.Spy;
  private selectedTagOutputSpy!: jasmine.Spy;

  async globalBeforeEach(): Promise<void> {
    this.configureTestBed();
    await TestBed.compileComponents();
    this.onComponentsCompilation();
  }

  private configureTestBed(): void {
    TestBed.configureTestingModule({
      imports: [GalleryNavComponent],
      providers: [
        {
          provide: TagApiService,
          useValue: this.fakeTagApiService,
        },
      ],
    });
  }

  private onComponentsCompilation(): void {
    this.fixture = TestBed.createComponent(GalleryNavComponent);
    this.testedComponent = this.fixture.componentInstance;
    this.fixture.autoDetectChanges();
    this.setLoadTagsSpy();
    this.setSelectedTagOutputSpy();
  }

  private setLoadTagsSpy(): void {
    this.loadTagsSpy = this.fakeTagApiService.search;
  }

  private setSelectedTagOutputSpy(): void {
    this.selectedTagOutputSpy = spyOn(this.testedComponent.selectedTag, 'emit');
  }

  resetCallsOfSelectedTagOutputSpy(): void {
    this.selectedTagOutputSpy.calls.reset();
  }

  getTestedComponent(): GalleryNavComponent {
    return this.testedComponent;
  }

  simulateLoadedTags(tags: ITag[] | Error | undefined): void {
    this.testedComponent.tagsResource.set(tags);
    this.fixture.detectChanges();
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  expectLoadTagsToHaveBeenCalled(): void {
    expect(this.loadTagsSpy).toHaveBeenCalled();
  }

  expectGalleriesNavToBeDisplayed(): void {
    const galleriesNav = this.getGalleryNav();
    expect(galleriesNav).toBeTruthy();
  }

  private getGalleryNav(): DebugElement {
    return this.getDebugElement('.gallery-nav__nav');
  }

  private getDebugElement(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
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
    const navItemsList = this.getGalleryNav().query(By.css('ul'));
    return navItemsList.children;
  }

  expectNoTagNavItemToBeDisplayed(): void {
    const noTagNavItem = this.getNoTagNavItem();
    expect(noTagNavItem).toBeTruthy();
  }

  private getNoTagNavItem(): DebugElement | undefined {
    return this.getNavItems().find(
      (item) => (item.nativeElement as HTMLElement).id === noTagNavItemId
    );
  }

  expectNavItemToBeSelected(navItemId: string): void {
    const item: DebugElement | undefined =
      navItemId === noTagNavItemId
        ? this.getNoTagNavItem()
        : this.getTagNavItem(navItemId);
    const isSelected = this.isSelected(item);
    expect(isSelected).toBeTrue();
  }

  private isSelected(element: DebugElement | undefined): boolean {
    if (!element) {
      return false;
    }
    const selectedClass = 'gallery-nav__nav-item--selected';
    return (element.nativeElement as HTMLElement).classList.contains(
      selectedClass
    );
  }

  clickOnNavItem(navItemId: string): void {
    const item: DebugElement | undefined =
      navItemId === noTagNavItemId
        ? this.getNoTagNavItem()
        : this.getTagNavItem(navItemId);

    (item?.nativeElement as HTMLElement).click();

    tick();
  }

  expectSelectedTagOutputToBe(expectedValue: ITag['_id'] | undefined): void {
    expect(this.selectedTagOutputSpy).toHaveBeenCalledOnceWith(expectedValue);
  }
}
