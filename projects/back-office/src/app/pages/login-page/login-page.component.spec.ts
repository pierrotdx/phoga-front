import { fakeAsync } from '@angular/core/testing';
import { AuthProviderFake } from '../../auth-context';
import { DebugElement } from '@angular/core';
import { LoginPageTestUtils } from './login-page.test-utils';
import {
  EndpointId,
  EndpointsProvider,
  IEndpoints,
} from '../../endpoints-context';

describe('LoginPageComponent', () => {
  let testUtils: LoginPageTestUtils;
  let endpoints: IEndpoints;

  beforeEach(async () => {
    const providers = [AuthProviderFake, EndpointsProvider];
    testUtils = new LoginPageTestUtils(providers);
    await testUtils.globalSetup();
    endpoints = testUtils.getEndpoints();
  });

  it('should be created', () => {
    const component = testUtils.getComponent();
    expect(component).toBeTruthy();
  });

  describe('the login button', () => {
    let loginButton: DebugElement;
    let loginSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;

    beforeEach(() => {
      loginButton = testUtils.getLoginButton();
      loginSpy = testUtils.getLoginSpy();
      navigateSpy = testUtils.getNavigateSpy();
    });

    it('should exist', () => {
      expect(loginButton).not.toBeNull();
    });

    describe('when clicked on', () => {
      it('should try to log the used in', fakeAsync(() => {
        testUtils.clickOn(loginButton);
        expect(loginSpy).toHaveBeenCalled();
      }));

      describe('in case of successful login', () => {
        let redirectUrl: string;

        beforeEach(() => {
          redirectUrl = endpoints.getRelativePath(EndpointId.HomePage);
        });

        it(`should redirect the user to the \`${EndpointId.HomePage}\` endpoint`, fakeAsync(() => {
          testUtils.clickOn(loginButton);
          expect(navigateSpy).toHaveBeenCalledOnceWith([redirectUrl]);
        }));
      });

      describe('in case of failed login', () => {
        let failedLoginError: Error;
        let consoleSpy: jasmine.Spy;

        beforeEach(() => {
          failedLoginError = new Error('login failed');
          loginSpy.and.rejectWith(failedLoginError);
          consoleSpy = spyOn(console, 'error');
        });

        it('should log the error into the console', fakeAsync(() => {
          testUtils.clickOn(loginButton);
          expect(consoleSpy).toHaveBeenCalledOnceWith(failedLoginError);
        }));
      });
    });
  });
});
