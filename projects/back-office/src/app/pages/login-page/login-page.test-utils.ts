import { provideRouter, Router } from '@angular/router';
import {
  EndpointId,
  ENDPOINTS_TOKEN,
  EndpointsProvider,
} from '@back-office/endpoints-context';
import { LoginPageComponent } from './login-page.component';
import { CompTestUtils } from '@shared/comp.test-utils';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestModuleMetadata } from '@angular/core/testing';

@Component({ selector: 'app-auth', template: '' })
export class AuthStubComponent {}

export class LoginPageTestUtils extends CompTestUtils<LoginPageComponent> {
  constructor() {
    const config: TestModuleMetadata = {
      imports: [LoginPageComponent, AuthStubComponent],
      providers: [EndpointsProvider, provideRouter([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    };
    super(LoginPageComponent, config);
  }

  async globalSetup(): Promise<void> {
    await this.internalBeforeEach();
  }

  getNavigateSpy(): jasmine.Spy {
    const router = this.testBed.inject(Router);
    return spyOn(router, 'navigate');
  }

  getRestrictedUrl(): string {
    const endpoints = this.testBed.inject(ENDPOINTS_TOKEN);
    return endpoints.getRelativePath(EndpointId.Restricted);
  }

  triggerSuccessfulLogin(): void {
    const isAuth = true;
    this.component.onAuthChange(isAuth);
    this.fixture.detectChanges();
  }
}
