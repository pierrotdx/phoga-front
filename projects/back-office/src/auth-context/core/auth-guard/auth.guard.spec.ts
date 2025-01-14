import { AuthGuard } from '@auth0/auth0-angular';
import { Scope } from '../models';
import { AuthGuardTestUtils } from './auth-guard.test-utils';

describe(`${AuthGuard.name}`, () => {
  let testUtils: AuthGuardTestUtils;

  beforeEach(() => {
    testUtils = new AuthGuardTestUtils();
  });

  afterEach(() => {
    testUtils.fakeRoute.data = {};
    testUtils.isAuthorizedSpy.and.callThrough();
  });

  it('should be created', () => {
    expect(testUtils.executeGuard).toBeTruthy();
  });

  it('should ask if the user is authorized', () => {
    const requiredScopes: Scope[] = [Scope.RestrictedRead, Scope.PhotosWrite];
    testUtils.fakeRoute.data = { scopes: requiredScopes };
    testUtils.executeGuard(testUtils.fakeRoute, testUtils.fakeState);
    expect(testUtils.isAuthorizedSpy).toHaveBeenCalledOnceWith(requiredScopes);
  });

  describe('if the user is authorized', () => {
    beforeEach(() => {
      testUtils.isAuthorizedSpy.and.returnValue(true);
    });

    it('should return `true`', () => {
      testUtils.expectCanActivateValue(true);
    });
  });

  describe('if the user is not authorized', () => {
    beforeEach(() => {
      testUtils.isAuthorizedSpy.and.returnValue(false);
    });

    it('should return `false` and navigate to the login page', () => {
      testUtils.expectCanActivateValue(false);
      expect(testUtils.routerMock.navigate).toHaveBeenCalled();
    });
  });
});
