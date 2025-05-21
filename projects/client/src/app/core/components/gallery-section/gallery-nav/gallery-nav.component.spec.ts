import { ISelectedTag, ITag } from '@shared/tag-context';
import { GalleryNavTestUtils, noTagNavItemId } from './gallery-nav.test-utils';
import { fakeAsync, tick } from '@angular/core/testing';

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

    describe('the navigation-menu trigger', () => {
      it('should be displayed', () => {
        const navMenuTrigger = testUtils.getNavMenuTrigger();
        expect(navMenuTrigger).toBeTruthy();
      });

      it('should display the selected navigation item', () => {
        const navMenuTrigger = testUtils.getNavMenuTrigger()
          .nativeElement as HTMLElement;
        const testedComponent = testUtils.getTestedComponent();
        let selectedTag: ISelectedTag = testedComponent.selectedTag();

        expect(selectedTag).toBeUndefined();
        let expectedValue = testUtils.getNoSelectionPlaceHolder();
        expect(navMenuTrigger.innerText).toBe(expectedValue);

        tags.forEach((tag) => {
          selectedTag = tag;

          testedComponent.selectNavItem(selectedTag);
          testUtils.detectChanges();

          expectedValue = selectedTag.name || selectedTag._id || '';
          expect(navMenuTrigger.innerText).toBe(expectedValue);
        });
      });

      describe('when clicked on', () => {
        it('should display the navigation menu', fakeAsync(() => {
          const navMenuTrigger = testUtils.getNavMenuTrigger()
            .nativeElement as HTMLElement;

          navMenuTrigger.click();
          testUtils.detectChanges();
          tick();

          const navMenu = testUtils.getGalleryNav();
          expect(navMenu).toBeTruthy();
        }));
      });
    });

    describe('the navigation menu', () => {
      it('should not be displayed by default', () => {
        const galleryNav = testUtils.getGalleryNav();
        expect(galleryNav).toBeFalsy();
      });

      describe('when displayed', () => {
        beforeEach(() => {
          testUtils.displayNavMenu();
        });

        describe('the "no-tag" navigation item', () => {
          it('should be displayed', () => {
            const noTagNavItem = testUtils.getNoTagNavItem();
            expect(noTagNavItem).toBeTruthy();
          });

          it('should be selected by default', () => {
            testUtils.expectSelectedNavItemToBe(noTagNavItemId);
          });

          describe('when clicked on', () => {
            it('should select the nav item', fakeAsync(() => {
              testUtils.clickOnNavItem(noTagNavItemId);
              testUtils.expectSelectedNavItemToBe(noTagNavItemId);
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
                testUtils.displayNavMenu();

                testUtils.clickOnNavItem(tag._id);

                testUtils.detectChanges();
                testUtils.expectSelectedNavItemToBe(tag._id);
              });
            }));

            it('should emit the tag id as the selected tag', fakeAsync(() => {
              tags.forEach((tag) => {
                testUtils.resetCallsOfSelectedTagOutputSpy();
                testUtils.clickOnNavItem(tag._id);
                testUtils.expectSelectedTagOutputToBe(tag);
              });
            }));
          });
        });
      });
    });
  });
});
