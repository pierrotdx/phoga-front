import { Provider } from '@angular/core';
import { Endpoints, ENDPOINTS_TOKEN } from '../../core';

export const EndpointsProvider: Provider = {
  provide: ENDPOINTS_TOKEN,
  useClass: Endpoints,
};
