import { InjectionToken } from '@angular/core';
import { EndpointId } from './endpoint-id';

export interface IEndpoints {
  getRelativePath(id: EndpointId): string;
  getFullPath(id: EndpointId): string;
}

export const ENDPOINTS_TOKEN = new InjectionToken<IEndpoints>('EndpointsToken');
