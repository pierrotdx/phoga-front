import { DebugElement } from '@angular/core';
import { NavigationTestUtils } from './navigation.test-utils';
import { fakeAsync } from '@angular/core/testing';

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
