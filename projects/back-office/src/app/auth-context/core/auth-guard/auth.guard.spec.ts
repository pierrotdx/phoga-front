import { Router } from '@angular/router';
import { AuthProviderFake } from '../../adapters';
import { AuthGuard } from '@auth0/auth0-angular';
import { EndpointsProvider } from '../../../endpoints-context';
import { Scope } from '../models';
import { AuthGuardTestUtils } from './auth-guard.test-utils';

describe(`${AuthGuard.name}`, () => {
  let testUtils: AuthGuardTestUtils;
  const routerMock = {
    navigate: jasmine.createSpy('navigateByUrl'),
  };

  beforeEach(() => {
    const providers = [
      AuthProviderFake,
      { provide: Router, useValue: routerMock },
      EndpointsProvider,
    ];
    testUtils = new AuthGuardTestUtils(providers);
  });

  it('should be created', () => {
    expect(testUtils.executeGuard).toBeTruthy();
  });

  describe('when the user is not authenticated', () => {
    beforeEach(() => {
      testUtils.emitIsAuthenticated(false);
    });

    it('should return `false` and navigate to the login page', () => {
      testUtils.expectCanActivateValue(false);
      expect(routerMock.navigate).toHaveBeenCalled();
    });
  });

  describe('when the user is authenticated', () => {
    let requiredScopes: Scope[] | undefined;
    let userScopes: Scope[] | undefined;

    beforeEach(() => {
      testUtils.emitIsAuthenticated(true);
    });

    afterEach(() => {
      requiredScopes = undefined;
      userScopes = undefined;
      testUtils.fakeRoute.data = {};
    });

    it('should return `true` when no specific scope is required', () => {
      testUtils.expectCanActivateValue(true);
    });

    it('should return `true` when the user has all of the required scopes', () => {
      requiredScopes = [Scope.PhotosRead];
      userScopes = requiredScopes;
      testUtils.setScopesScenario(requiredScopes, userScopes);
      testUtils.expectCanActivateValue(true);
    });

    it('should return `false` when the user does not have all of the required scopes', () => {
      requiredScopes = [Scope.PhotosRead, Scope.PhotosWrite];
      userScopes = requiredScopes.slice(0, 1);
      testUtils.setScopesScenario(requiredScopes, userScopes);
      testUtils.expectCanActivateValue(false);
    });
  });
});
