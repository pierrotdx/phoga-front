import { NavigationTestUtils } from './navigation.test-utils';

describe('NavigationComponent', () => {
  let testUtils: NavigationTestUtils;

  beforeEach(async () => {
    testUtils = new NavigationTestUtils();
    await testUtils.globalSetup();
  });

  afterEach(() => {
    testUtils.resetSpies();
  });

  it('should be created', () => {
    expect(testUtils.component).toBeTruthy();
  });
});
