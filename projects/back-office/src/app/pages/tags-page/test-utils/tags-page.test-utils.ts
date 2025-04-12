import { TestBed } from '@angular/core/testing';
import { ITag } from '@shared/public-api';
import { TagsPageComponent } from '../tags-page.component';
import { TagsPageBaseTestUtils } from './tags-page.base.test-utils';

export class TagsPageTestUtils extends TagsPageBaseTestUtils {
  constructor() {
    super();
  }

  async globalBeforeEach() {
    await TestBed.compileComponents();
    this.onComponentsCompilation();
    this.fixture = TestBed.createComponent(TagsPageComponent);
    this.onComponentCreation();
  }

  expectTestedComponentToBeCreated(): void {
    expect(this.testedComponent).toBeTruthy();
  }

  getLoadAllTagsSpy() {
    return this.loadAllTagsSpy;
  }

  expectAddTagAnchorToBeDisplayed(): void {
    const addTagAnchor = this.getAddTagAnchor();
    expect(addTagAnchor).toBeTruthy();
  }

  expectAddTagAnchorToRedirectToAddTagPage(): void {
    const anchor = this.getAddTagAnchor();
    this.expectAnchorToRedirectTo(anchor, this.addTagPageUrl);
  }

  fakeTags(tags: ITag[]): void {
    this.testedComponent.tags.set(tags);
  }

  detectChanges(): void {
    this.fixture.detectChanges();
  }

  expectTagsListToBe(expectedDisplay: 'displayed' | 'not displayed'): void {
    const isTagsListDisplayed = !!this.getTagsList();
    expect(isTagsListDisplayed).toBe(expectedDisplay === 'displayed');
  }

  expectTagAnchorToRedirectToEditTagPage(tagIndex: number): void {
    const tagAnchor = this.getTagAnchor(tagIndex);
    const expectedUrl = this.getEditTagPageUrl(tagIndex);
    this.expectAnchorToRedirectTo(tagAnchor, expectedUrl);
  }

  expectTagTextToBe(tagIndex: number, expectedText: string): void {
    const tagItemText = this.getTagText(tagIndex);
    expect(tagItemText).toBe(expectedText);
  }
}
