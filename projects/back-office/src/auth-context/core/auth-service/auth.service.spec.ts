import { AuthService } from './auth.service';
import { AuthServiceTestUtils } from './auth-service.test-utils';
import { Scope } from '../models';

describe('AuthService', () => {
  const fakeToken = 'lorem ipsum token';

  let testUtils: AuthServiceTestUtils;
  let service: AuthService;

  beforeEach(() => {
    testUtils = new AuthServiceTestUtils();
    service = testUtils.authService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`${AuthService.prototype.isAuthenticated.name}`, () => {
    describe('when the user does not have a valid access token', () => {
      beforeEach(() => {
        testUtils.isTokenValidSpy.and.returnValue(false);
      });

      afterEach(() => {
        testUtils.isTokenValidSpy.and.callThrough();
      });

      it('should return `false` ', () => {
        const isAuth = service.isAuthenticated();
        expect(isAuth).toBe(false);
      });
    });

    describe('when the user has a valid access token', () => {
      beforeEach(() => {
        testUtils.isTokenValidSpy.and.returnValue(true);
      });

      afterEach(() => {
        testUtils.isTokenValidSpy.and.callThrough();
      });

      it('should return `true` ', () => {
        const isAuth = service.isAuthenticated();
        expect(isAuth).toBe(true);
      });
    });
  });

  describe(`${AuthService.prototype.login.name}`, () => {
    beforeEach(() => {
      testUtils.fetchAccessTokenSpy.and.resolveTo(fakeToken);
      service.accessToken$.next(undefined);
    });

    afterEach(() => {
      testUtils.fetchAccessTokenSpy.and.callThrough();
    });

    it('should fetch an access token and update the local storage', async () => {
      const accessTokenBefore = service.accessToken$.getValue();
      await service.login();
      const accessTokenAfter = service.accessToken$.getValue();
      expect(accessTokenBefore).toBeUndefined();
      expect(accessTokenAfter).toBeDefined();
      expect(accessTokenAfter).toEqual(fakeToken);
      expect(testUtils.fetchAccessTokenSpy).toHaveBeenCalledTimes(1);
      expect(testUtils.setStoredTokenSpy).toHaveBeenCalledOnceWith(fakeToken);
    });
  });

  describe(`${AuthService.prototype.logout.name}`, () => {
    beforeEach(async () => {
      service.accessToken$.next(fakeToken);
    });

    it('should reset the access token and clear the local storage', async () => {
      const accessTokenBefore = service.accessToken$.getValue();
      await service.logout();
      const accessTokenAfter = service.accessToken$.getValue();
      expect(accessTokenBefore).toEqual(fakeToken);
      expect(accessTokenAfter).toBeUndefined();
      expect(testUtils.clearStoredTokenSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe(`${AuthService.prototype.isAuthorized.name}`, () => {
    let requiredScopes: Scope[];
    let userScopes: Scope[];

    afterEach(() => {
      requiredScopes = [];
      userScopes = [];
      testUtils.getUserScopesSpy.and.callThrough();
    });

    describe('when user is not logged in', () => {
      const tokenIsValidIfDefined = (token: string): boolean => !!token;

      beforeEach(() => {
        service.accessToken$.next(undefined);
        testUtils.isTokenValidSpy.and.callFake(tokenIsValidIfDefined);
      });

      afterEach(() => {
        testUtils.isTokenValidSpy.and.callThrough();
      });

      it('should return `false` if no specific scope is required', () => {
        const isAuthorized = service.isAuthorized();
        expect(isAuthorized).toBeFalse();
      });

      it('should return `false` even if user has expected scopes', () => {
        requiredScopes = [Scope.PhotosRead];
        userScopes = requiredScopes;
        testUtils.getUserScopesSpy.and.returnValue(userScopes);
        const isAuthorized = service.isAuthorized(requiredScopes);
        expect(isAuthorized).toBeFalse();
      });
    });

    describe('when user is logged in', () => {
      beforeEach(() => {
        testUtils.isTokenValidSpy.and.returnValue(true);
        service.accessToken$.next(fakeToken);
      });

      afterEach(() => {
        testUtils.isTokenValidSpy.and.callThrough();
      });

      it('should return `true` is no scope is required', () => {
        const isAuthorized = service.isAuthorized();
        expect(isAuthorized).toBe(true);
      });

      it('should return `true` when the user has all of the required scopes', () => {
        const requiredScopes = [Scope.PhotosRead];
        const userScopes = requiredScopes;
        testUtils.getUserScopesSpy.and.returnValue(userScopes);
        const isAuthorized = service.isAuthorized();
        expect(isAuthorized).toBe(true);
      });

      it('should return `false` when the user does not have all of the required scopes', () => {
        requiredScopes = [Scope.PhotosRead, Scope.PhotosWrite];
        userScopes = requiredScopes.slice(0, 1);
        testUtils.getUserScopesSpy.and.returnValue(userScopes);
        const isAuthorized = service.isAuthorized(requiredScopes);
        expect(isAuthorized).toBe(false);
      });
    });
  });
});
