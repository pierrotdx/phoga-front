import { TagsPageTestUtils } from './test-utils/tags-page.test-utils';
import { ITag } from '@shared/tag-context';

describe('TagsPageComponent', () => {
  let testUtils: TagsPageTestUtils;

  beforeEach(async () => {
    testUtils = new TagsPageTestUtils();
    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
  });

  it('should load all the tags on component creation', () => {
    const loadAllTagsSpy = testUtils.getLoadAllTagsSpy();
    expect(loadAllTagsSpy).toHaveBeenCalledTimes(1);
  });

  describe('the "Add tags" anchor', () => {
    it('should be displayed', () => {
      testUtils.expectAddTagAnchorToBeDisplayed();
    });

    it('should redirect to the add-tag page', () => {
      testUtils.expectAddTagAnchorToRedirectToAddTagPage();
    });
  });

  describe('the tags list', () => {
    describe('when there are no tags to display', () => {
      it('should not be displayed', () => {
        testUtils.expectTagsListToBe('not displayed');
      });
    });

    describe('when there are tags to display', () => {
      const tags: ITag[] = [{ _id: 'tag1', name: 'tag name' }, { _id: 'tag2' }];

      beforeEach(() => {
        testUtils.fakeTags(tags);
        testUtils.detectChanges();
      });

      it('should display the tags list', () => {
        testUtils.expectTagsListToBe('displayed');
      });

      describe("each list's element", () => {
        it('should redirect to the tag-edit page with the appropriate tag id', () => {
          tags.forEach((tag, tagIndex) => {
            testUtils.expectTagAnchorToRedirectToEditTagPage(tagIndex);
          });
        });

        describe('when the tag has a name', () => {
          it("should display the tag's name", () => {
            const tagIndex = 0;
            testUtils.expectTagTextToBe(tagIndex, tags[tagIndex].name!);
          });
        });

        describe('when the tag does not have a name', () => {
          it("should display the tag's id", () => {
            const tagIndex = 1;
            testUtils.expectTagTextToBe(tagIndex, tags[tagIndex]._id);
          });
        });
      });
    });
  });
});
