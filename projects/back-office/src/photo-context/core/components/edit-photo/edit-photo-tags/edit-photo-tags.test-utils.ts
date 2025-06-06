import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { EditPhotoTagsComponent } from './edit-photo-tags.component';
import { ITag, TagApiService } from '@shared/tag-context';
import { DebugElement, Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatOption, MatSelect } from '@angular/material/select';
import { ISearchResult } from '@shared/models';

export class EditPhotoTagsTestUtils {
  private fakeTagApiService = jasmine.createSpyObj<TagApiService>(
    'TagApiService',
    ['search']
  );
  private readonly tagApiServiceProvider: Provider = {
    provide: TagApiService,
    useValue: this.fakeTagApiService,
  };

  private testedComponent!: EditPhotoTagsComponent;
  private fixture!: ComponentFixture<EditPhotoTagsComponent>;

  async globalBeforeEach(): Promise<void> {
    TestBed.configureTestingModule({
      imports: [EditPhotoTagsComponent],
      providers: [this.tagApiServiceProvider],
    });
    await TestBed.compileComponents();
    this.onCompileComponents();
    this.fixture.detectChanges();
    this.fixture.autoDetectChanges();
  }

  private onCompileComponents(): void {
    this.fixture = TestBed.createComponent(EditPhotoTagsComponent);
    this.testedComponent = this.fixture.componentInstance;
  }

  expectComponentToBeCreated() {
    expect(this.testedComponent).toBeTruthy();
  }

  getLoadTagsSpy() {
    return this.fakeTagApiService.search;
  }

  getLoadingPlaceHolder(): DebugElement {
    const selector = '.edit-photo-tags__loading';
    return this.getDebugElement(selector);
  }

  private getDebugElement(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }

  simulateLoadingState(isLoading: boolean): void {
    spyOn(this.testedComponent.tagsResource, 'isLoading').and.returnValue(
      isLoading
    );
    this.fixture.detectChanges();
  }

  simulateLoadedTags(searchResult: ISearchResult<ITag>): void {
    this.testedComponent.tagsResource.set(searchResult);
    this.fixture.detectChanges();
  }

  getNoTagsPlaceHolder(): DebugElement {
    const selector = '.edit-photo-tags__no-tags';
    return this.getDebugElement(selector);
  }

  getTagSelection(): DebugElement {
    const selector = '.edit-photo-tags__tag-selector';
    return this.getDebugElement(selector);
  }

  async expectsNoTagsPlaceHolder(): Promise<void> {
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    const expectedPlaceHolder = this.testedComponent['noTagsPlaceHolder'];
    this.expectTagSelectionPlaceHolderToBe(expectedPlaceHolder);
  }

  private expectTagSelectionPlaceHolderToBe(expectedPlaceHolder: string): void {
    const tagSelection = this.getTagSelection().componentInstance as MatSelect;
    expect(tagSelection.placeholder).toEqual(expectedPlaceHolder);
  }

  expectTagToBeInTagSelection(expectedTagId: ITag['_id']): void {
    const tagOption = this.getTagOption(expectedTagId);
    expect(tagOption).toBeDefined();
  }

  private getTagOption(id: ITag['_id']): MatOption | undefined {
    const select = this.getTagSelection().componentInstance as MatSelect;
    return select.options.find((opt) => opt.value === id);
  }

  expectSelectTagsPlaceHolder(): void {
    const expectedPlaceHolder = this.testedComponent['selectTagPlaceHolder'];
    this.expectTagSelectionPlaceHolderToBe(expectedPlaceHolder);
  }

  selectTagOption(id: ITag['_id']): void {
    const tagOption = this.getTagOption(id);
    if (!tagOption) {
      throw new Error(`option of tag '${id}' not found`);
    }
    tagOption.select();
    tick();
  }

  expectViewModelToEqual(expectedViewModel: ITag['_id'][] | undefined): void {
    const viewModel = this.testedComponent.viewModel();
    expect(viewModel).toEqual(expectedViewModel);
  }

  async inputViewModel(viewModel: ITag['_id'][]): Promise<void> {
    this.fixture.componentRef.setInput('viewModel', viewModel);
    await this.fixture.whenStable();
  }

  expectSelectedTagsToBe(expectedSelectedTags: ITag['_id'][]): void {
    expectedSelectedTags.forEach((expectedTagId) => {
      const tagOption = this.getTagOption(expectedTagId);
      expect(tagOption?.selected).toBeTrue();
    });
  }
}
