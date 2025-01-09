import { Provider } from '@angular/core';
import { UUID_PROVIDER_TOKEN, UuidGenerator } from '@shared/uuid-context/core';

export const UuidProvider: Provider = {
  provide: UUID_PROVIDER_TOKEN,
  useClass: UuidGenerator,
};