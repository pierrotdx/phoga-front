import { EndpointId } from '@back-office/endpoints-context';
import { LoginPageTestUtils } from './login-page.test-utils';

describe('LoginPageComponent', () => {
  let testUtils: LoginPageTestUtils;

  beforeEach(async () => {
    testUtils = new LoginPageTestUtils();
    await testUtils.globalSetup();
  });

  it('should be created', () => {
    const component = testUtils.component;
    expect(component).toBeTruthy();
  });

  it(`should redirect the user to the \`${EndpointId.Restricted}\` endpoint after successful authentication`, () => {
    const navigateSpy = testUtils.getNavigateSpy();
    const restrictedUrl = testUtils.getRestrictedUrl();
    testUtils.triggerSuccessfulLogin();
    expect(navigateSpy).toHaveBeenCalledOnceWith([restrictedUrl]);
  });
});
