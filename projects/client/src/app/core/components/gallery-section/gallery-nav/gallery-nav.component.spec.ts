import { GalleryNavTestUtils } from './gallery-nav.test-utils';
import { fakeAsync, tick } from '@angular/core/testing';
import { IGallery } from '@shared/photo-context';

describe('GalleryNavComponent', () => {
  let testUtils: GalleryNavTestUtils;

  beforeEach(async () => {
    testUtils = new GalleryNavTestUtils();

    await testUtils.globalBeforeEach();
  });

  it('should create', () => {
    testUtils.expectTestedComponentToBeCreated();
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

      const initSelectedGallery: IGallery | undefined =
        testedComponent.selectedGallery();
      expect(initSelectedGallery).toBeUndefined();
      let expectedValue = testUtils.getNoSelectionPlaceHolder();
      expect(navMenuTrigger.innerText).toBe(expectedValue);

      testUtils.galleries.forEach((gallery) => {
        testedComponent.selectNavItem(gallery._id);
        testUtils.detectChanges();

        expectedValue = gallery.name ?? gallery._id;
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

      describe('the navigation items', () => {
        it('should be displayed with one navigation item per gallery', () => {
          testUtils.galleries.forEach((gallery) => {
            testUtils.expectNavItemToBeDisplayed(gallery._id);
          });
        });

        describe('when clicked on', () => {
          it('should select the nav item', fakeAsync(() => {
            testUtils.galleries.forEach((gallery) => {
              testUtils.displayNavMenu();

              testUtils.clickOnNavItem(gallery._id);

              testUtils.detectChanges();
              testUtils.expectSelectedNavItemToBe(gallery._id);
            });
          }));

          it('should select the required gallery', fakeAsync(() => {
            testUtils.galleries.forEach((gallery) => {
              const selectSpy = testUtils.getSelectGallerySpy();
              selectSpy.calls.reset();
              testUtils.clickOnNavItem(gallery._id);
              expect(selectSpy).toHaveBeenCalledOnceWith(gallery._id);
            });
          }));
        });
      });
    });
  });
});
