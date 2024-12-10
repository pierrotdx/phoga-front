import { DebugElement } from '@angular/core';
import { AuthProviderFake } from '../../auth-context';
import { HeaderTestUtils } from './header.test-utils';
import { fakeAsync } from '@angular/core/testing';

describe('HeaderComponent', () => {
  let testUtils: HeaderTestUtils;

  beforeEach(async () => {
    const providers = [AuthProviderFake];
    testUtils = new HeaderTestUtils(providers);
    await testUtils.globalSetup();
  });

  it('should be created', () => {
    expect(testUtils.component).toBeTruthy();
  });

  describe('logout button', () => {
    let logoutButton: DebugElement;

    beforeEach(() => {
      testUtils.triggerLogin();
      logoutButton = testUtils.getLogoutButton();
    });

    it('should be hidden when user is not logged in', () => {
      testUtils.triggerLogout();
      logoutButton = testUtils.getLogoutButton();
      expect(logoutButton).toBeNull();
    });

    it('should be shown when user is logged in', () => {
      expect(logoutButton).not.toBeNull();
    });

    describe('when clicked on', () => {
      let logoutSpy: jasmine.Spy;

      beforeEach(() => {
        logoutSpy = testUtils.getLogoutSpy();
      });

      it('should try to log the user out', fakeAsync(() => {
        testUtils.clickOn(logoutButton);
        expect(logoutSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
