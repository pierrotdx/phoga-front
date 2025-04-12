import { Route } from '@angular/router';
import { IEndpoints } from '../../../endpoints-context';

export type TAdminTagRoute = (endpoints: IEndpoints) => Route;
