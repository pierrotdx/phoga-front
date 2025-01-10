import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

import { inject } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';

const AdminUrlFragment = '/admin';

export const authHttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const isAdminRoute = req.url?.includes(AdminUrlFragment);
  if (!isAdminRoute) {
    return next(req);
  }
  const authService = inject(AuthService);
  return authService.accessToken$.pipe(
    map((accessToken) => getReqWithAuthBearer(req, accessToken)),
    switchMap((reqWithAuthBearer) => next(reqWithAuthBearer))
  );
};

function getReqWithAuthBearer(
  req: HttpRequest<any>,
  accessToken?: string
): HttpRequest<any> {
  if (!accessToken) {
    return req;
  }
  const headers = req.headers.append('Authorization', `Bearer ${accessToken}`);
  const authReq = req.clone({ headers });
  return authReq;
}
