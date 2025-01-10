import { fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { EndpointId, IEndpoints } from '@back-office/endpoints-context';
import { LoginPageTestUtils } from './login-page.test-utils';

describe('LoginPageComponent', () => {
  let testUtils: LoginPageTestUtils;
  let endpoints: IEndpoints;

  beforeEach(async () => {
    testUtils = new LoginPageTestUtils();
    await testUtils.globalSetup();
    endpoints = testUtils.getEndpoints();
  });

  afterEach(() => {
    testUtils.resetSpies();
  });

  it('should be created', () => {
    const component = testUtils.getComponent();
    expect(component).toBeTruthy();
  });

  describe('the login button', () => {
    let loginButton: DebugElement;
    let redirectUrl: string;

    beforeEach(() => {
      loginButton = testUtils.getLoginButton();
      redirectUrl = endpoints.getRelativePath(EndpointId.Restricted);
    });

    it('should exist', () => {
      expect(loginButton).not.toBeNull();
    });

    it(`should redirect the user to the \`${EndpointId.Restricted}\` endpoint when authentication occurs`, () => {
      testUtils.fakeAuthentication();
      expect(testUtils.navigateSpy).toHaveBeenCalledOnceWith([redirectUrl]);
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
});
