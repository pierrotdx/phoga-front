import { ENVIRONMENT_TOKEN } from '../../../environment-context';
import { TagApiService } from '../../core';
import { ITagApiServiceProvider } from '../../core/gateways';
import { HttpClient } from '@angular/common/http';

export const TagApiServiceProvider: ITagApiServiceProvider = {
  provide: TagApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};
