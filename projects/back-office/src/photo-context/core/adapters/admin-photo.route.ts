import { Route } from '@angular/router';
import { IEndpoints } from '../../../endpoints-context';

export type TAdminPhotoRoute = (endpoints: IEndpoints) => Route;
