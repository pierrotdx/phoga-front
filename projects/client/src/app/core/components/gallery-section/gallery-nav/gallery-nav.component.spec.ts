import { ITag } from '@shared/tag-context';
import { GalleryNavTestUtils, noTagNavItemId } from './gallery-nav.test-utils';
import { fakeAsync } from '@angular/core/testing';

describe('GalleryNavComponent', () => {
  let testUtils: GalleryNavTestUtils;

  beforeEach(async () => {
    testUtils = new GalleryNavTestUtils();

    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
  });

  it('should load the tags on creation', () => {
    testUtils.expectLoadTagsToHaveBeenCalled();
  });

  describe('when tags are loaded', () => {
    const tags: ITag[] = [
      { _id: 'tag1', name: 'Tag 1' },
      { _id: 'tag2', name: 'Tag 2' },
    ];

    beforeEach(() => {
      testUtils.simulateLoadedTags(tags);
    });

    describe('the navigation menu', () => {
      it('should be displayed', () => {
        testUtils.expectGalleriesNavToBeDisplayed();
      });

      describe('the "no-tag" navigation item', () => {
        it('should be displayed', () => {
          testUtils.expectNoTagNavItemToBeDisplayed();
        });

        it('should be selected by default', () => {
          testUtils.expectNavItemToBeSelected(noTagNavItemId);
        });

        describe('when clicked on', () => {
          it('should select the nav item', fakeAsync(() => {
            testUtils.clickOnNavItem(noTagNavItemId);
            testUtils.expectNavItemToBeSelected(noTagNavItemId);
          }));

          it('should emit `undefined` as the selected tag', fakeAsync(() => {
            testUtils.clickOnNavItem(noTagNavItemId);
            testUtils.expectSelectedTagOutputToBe(undefined);
          }));
        });
      });

      describe('the tags navigation items', () => {
        it('should be displayed with one navigation item per tag', () => {
          tags.forEach((tag) => {
            testUtils.expectTagNavItemToBeDisplayed(tag._id);
          });
        });

        describe('when clicked on', () => {
          it('should select the nav item', fakeAsync(() => {
            tags.forEach((tag) => {
              testUtils.clickOnNavItem(tag._id);
              testUtils.expectNavItemToBeSelected(tag._id);
            });
          }));

          it('should emit the tag id as the selected tag', fakeAsync(() => {
            tags.forEach((tag) => {
              testUtils.resetCallsOfSelectedTagOutputSpy();
              testUtils.clickOnNavItem(tag._id);
              testUtils.expectSelectedTagOutputToBe(tag._id);
            });
          }));
        });
      });
    });
  });
});
