import { InjectionToken } from '@angular/core';

export interface IUuidGenerator {
  generate(): string;
}

export const UUID_PROVIDER_TOKEN = new InjectionToken<IUuidGenerator>(
  'UuidGenerator'
);
