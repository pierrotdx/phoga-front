import { DebugElement } from '@angular/core';
import { NavSidebarTestUtils } from './nav-sidebar.test-utils';
import { fakeAsync } from '@angular/core/testing';

describe('NavSidebarComponent', () => {
  let testUtils: NavSidebarTestUtils;

  beforeEach(async () => {
    testUtils = new NavSidebarTestUtils();
    await testUtils.globalSetup();
  });

  afterEach(() => {
    testUtils.resetSpies();
  });

  it('should be created', () => {
    expect(testUtils.component).toBeTruthy();
  });

  describe('logout button', () => {
    let logoutButton: DebugElement;

    beforeEach(() => {
      testUtils.triggerLogin();
    });

    it('should be hidden when user is not logged in', () => {
      testUtils.triggerLogout();
      logoutButton = testUtils.getLogoutButton();
      expect(logoutButton).toBeNull();
    });

    it('should be shown when user is logged in', () => {
      logoutButton = testUtils.getLogoutButton();
      expect(logoutButton).not.toBeNull();
    });

    describe('when clicked on', () => {
      it('should try to log the user out', fakeAsync(() => {
        testUtils.clickOnLogoutButton();
        expect(testUtils.logoutSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
