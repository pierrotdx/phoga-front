import { Route } from '@angular/router';
import { IEndpoints } from '../../../endpoints-context';

export type IAdminTagRoute = (endpoints: IEndpoints) => Route;
