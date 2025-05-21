import { ITag } from '@shared/tag-context';
import { EditPhotoTagsTestUtils } from './edit-photo-tags.test-utils';
import { fakeAsync } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';

describe('EditPhotoTagsComponent', () => {
  let testUtils: EditPhotoTagsTestUtils;

  beforeEach(async () => {
    testUtils = new EditPhotoTagsTestUtils();

    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectComponentToBeCreated();
  });

  it('should load the tags list at the component creation', () => {
    const loadTagsSpy = testUtils.getLoadTagsSpy();
    expect(loadTagsSpy).toHaveBeenCalled();
  });

  describe('when the tags are loading', () => {
    beforeEach(() => {
      const isLoading = true;
      testUtils.simulateLoadingState(isLoading);
    });

    it('should  display the loading place holder', () => {
      const loadingPlaceHolder = testUtils.getLoadingPlaceHolder();

      expect(loadingPlaceHolder).toBeTruthy();
    });
  });

  describe('when the tags are loaded', () => {
    describe('the tag selection', () => {
      beforeEach(() => {
        testUtils.simulateLoadingState(false);
      });

      it('should be displayed', () => {
        const tagSelection = testUtils.getTagSelection();

        expect(tagSelection).toBeTruthy();
      });

      it('should allow selection of multiple tags', () => {
        const tagSelection = testUtils.getTagSelection();
        const hasMultipleSelection = tagSelection.attributes['multiple'];

        expect(hasMultipleSelection).toBeDefined();
      });
    });

    describe('when the list of loaded tags is empty', () => {
      beforeEach(() => {
        testUtils.simulateLoadedTags([]);
      });

      describe('the tag selection', () => {
        it('should display a placeholder indicating no tags is available', async () => {
          await testUtils.expectsNoTagsPlaceHolder();
        });

        it('should be disabled', () => {
          const select = testUtils.getTagSelection()
            .componentInstance as MatSelect;
          expect(select.disabled).toBeDefined();
        });
      });
    });

    describe('when the list of loaded tags is not empty', () => {
      const loadedTags: ITag[] = [
        { _id: 'tag-1', name: 'name of tag 1' },
        { _id: 'tag-2' },
        { _id: 'tag-3' },
        { _id: 'tag-4' },
      ];

      beforeEach(() => {
        testUtils.simulateLoadedTags(loadedTags);
      });

      describe('the tag selection', () => {
        it('should display the list of tag options', () => {
          loadedTags.forEach((tag) => {
            testUtils.expectTagToBeInTagSelection(tag._id);
          });
        });

        it('should update the view model when a tag is selected', fakeAsync(() => {
          const tagToClickOn = loadedTags[1];
          const expectedViewModel = [tagToClickOn._id];

          testUtils.selectTagOption(tagToClickOn._id);

          testUtils.expectViewModelToEqual(expectedViewModel);
        }));
      });

      describe('when no tag is selected', () => {
        it('should display a placeholder inviting the user to select tags', () => {
          testUtils.expectSelectTagsPlaceHolder();
        });
      });

      describe("when the input view model has tags at component's initialization", () => {
        const initialSelectedTagIds: ITag['_id'][] = [
          loadedTags[1]._id,
          loadedTags[3]._id,
        ];

        beforeEach(async () => {
          await testUtils.inputViewModel(initialSelectedTagIds);
        });

        describe('the tag selection', () => {
          it('should be initiated with those tags', () => {
            const expectedSelectedTags = initialSelectedTagIds;
            testUtils.expectSelectedTagsToBe(expectedSelectedTags);
          });
        });
      });
    });
  });
});
