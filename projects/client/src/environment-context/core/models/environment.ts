import { InjectionToken } from '@angular/core';
import { IContact } from '@shared/contact-context';
import { ISharedEnvironment } from '@shared/environment-context';

export interface IEnvironment extends ISharedEnvironment {
  mainContact: IContact;
  designContact: IContact;
}

export const ENVIRONMENT_TOKEN = new InjectionToken<IEnvironment>(
  'Environment'
);
