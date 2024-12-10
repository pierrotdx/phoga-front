import { AuthService } from './auth.service';
import { AuthProviderFake } from '../../adapters';
import { AuthServiceTestUtils } from './auth-service.test-utils';

describe('AuthService', () => {
  let testUtils: AuthServiceTestUtils;
  let service: AuthService;

  beforeEach(() => {
    const providers = [AuthProviderFake];
    testUtils = new AuthServiceTestUtils(providers);
    service = testUtils.authService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`${AuthService.prototype.login.name}`, () => {
    it('should log the user in', async () => {
      const isAuthBefore = testUtils.isAuthenticated();
      await service.login();
      expect(isAuthBefore).toBeFalse();
      const isAuthAfter = testUtils.isAuthenticated();
      expect(isAuthAfter).toBeTrue();
    });
  });

  describe(`${AuthService.prototype.getAccessToken.name}`, () => {
    it('should ask for login if the user is not authenticated yet', async () => {
      const loginSpy = spyOn(service, 'login');
      await service.getAccessToken();
      expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it("should return the user's access token", async () => {
      const accessToken = await service.getAccessToken();
      expect(accessToken).toBeDefined();
      expect(accessToken).toBeInstanceOf(String);
    });
  });

  describe(`${AuthService.prototype.logout.name}`, () => {
    beforeEach(async () => {
      await service.login();
    });

    it('should log the user out', async () => {
      const isAuthBefore = testUtils.isAuthenticated();
      await service.logout();
      const isAuthAfter = testUtils.isAuthenticated();
      expect(isAuthBefore).toBeTrue();
      expect(isAuthAfter).toBeFalse();
    });

    it("should reset the user's access token within the application", async () => {
      const accessTokenBefore = testUtils.getAccessToken();
      await service.logout();
      const accessTokenAfter = testUtils.getAccessToken();
      expect(accessTokenBefore).toBeDefined();
      expect(accessTokenAfter).toBeUndefined();
    });
  });
});
