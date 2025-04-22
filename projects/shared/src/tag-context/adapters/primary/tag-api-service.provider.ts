import { TagApiService } from '../../core';
import { ITagApiServiceProvider } from '../../core/gateways';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT_TOKEN } from '@back-office/environment-context';

export const TagApiServiceProvider: ITagApiServiceProvider = {
  provide: TagApiService,
  deps: [ENVIRONMENT_TOKEN, HttpClient],
};
