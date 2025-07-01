import { DebugElement } from '@angular/core';
import { AuthTestUtils } from './auth.test-utils';
import { fakeAsync } from '@angular/core/testing';

describe('AuthComponent', () => {
  let testUtils: AuthTestUtils;
  const loginBtnId = 'login';
  const logoutBtnId = 'logout';

  beforeEach(async () => {
    testUtils = new AuthTestUtils();
    await testUtils.beforeEachGlobal();
  });

  afterEach(() => {
    testUtils.resetSpies();
  });

  it('should create', () => {
    expect(testUtils.getComponent()).toBeTruthy();
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      testUtils.fakeAuthenticationTo(false);
    });

    describe('the login button', () => {
      let loginButton: DebugElement;

      beforeEach(() => {
        loginButton = testUtils.getElementById(loginBtnId);
      });

      it('should exist', () => {
        expect(loginButton).not.toBeNull();
      });

      describe('when clicked on', () => {
        it('should try to log the used in', fakeAsync(() => {
          testUtils.clickOn(loginButton);
          expect(testUtils.loginSpy).toHaveBeenCalled();
        }));

        describe('in case of failed login', () => {
          let failedLoginError: Error;

          beforeEach(() => {
            failedLoginError = new Error('login failed');
            testUtils.loginSpy.and.rejectWith(failedLoginError);
          });

          it('should log the error into the console', fakeAsync(() => {
            testUtils.clickOn(loginButton);
            expect(testUtils.consoleSpy).toHaveBeenCalledOnceWith(
              failedLoginError
            );
          }));
        });
      });
    });

    describe('the logout button', () => {
      let logoutButton: DebugElement;

      beforeEach(() => {
        logoutButton = testUtils.getElementById(logoutBtnId);
      });

      it('should not exist', () => {
        expect(logoutButton).toBeNull();
      });
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      testUtils.fakeAuthenticationTo(true);
    });

    describe('the login button', () => {
      let loginButton: DebugElement;

      beforeEach(() => {
        loginButton = testUtils.getElementById(loginBtnId);
      });

      it('should not exist', () => {
        expect(loginButton).toBeNull();
      });
    });

    describe('the logout button', () => {
      let logoutButton: DebugElement;

      beforeEach(() => {
        logoutButton = testUtils.getElementById(logoutBtnId);
      });

      it('should exist', () => {
        expect(logoutButton).not.toBeNull();
      });

      describe('when clicked on', () => {
        it('should try to log the user out', fakeAsync(() => {
          testUtils.clickOn(logoutButton);
          expect(testUtils.logoutSpy).toHaveBeenCalled();
        }));

        describe('in case of failed logout', () => {
          let failedLogoutError: Error;

          beforeEach(() => {
            failedLogoutError = new Error('logout failed');
            testUtils.logoutSpy.and.rejectWith(failedLogoutError);
          });

          it('should log the error into the console', fakeAsync(() => {
            testUtils.clickOn(logoutButton);
            expect(testUtils.consoleSpy).toHaveBeenCalledOnceWith(
              failedLogoutError
            );
          }));
        });
      });
    });
  });
});
