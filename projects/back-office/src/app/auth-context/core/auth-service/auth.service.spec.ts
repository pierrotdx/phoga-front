import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AuthProviderFake } from '../../adapters';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthProviderFake],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`${AuthService.prototype.login.name}`, () => {
    it('should log the user in', async () => {
      const isAuthBefore = service.isAuthenticated$.getValue();
      await service.login();
      expect(isAuthBefore).toBeFalse();
      const isAuthAfter = service.isAuthenticated$.getValue();
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
      const isAuthBefore = service.isAuthenticated$.getValue();
      await service.logout();
      const isAuthAfter = service.isAuthenticated$.getValue();
      expect(isAuthBefore).toBeTrue();
      expect(isAuthAfter).toBeFalse();
    });

    it("should reset the user's access token within the application", async () => {
      const accessToken$ = service['accessToken$'];
      const accessTokenBefore = accessToken$.getValue();
      await service.logout();
      const accessTokenAfter = accessToken$.getValue();
      expect(accessTokenBefore).toBeDefined();
      expect(accessTokenAfter).toBeUndefined();
    });
  });
});
