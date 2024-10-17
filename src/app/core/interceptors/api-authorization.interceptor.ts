import { HttpInterceptorFn } from '@angular/common/http';
import { urlsAuthorization } from '../utils/urls-api';

export const apiAuthorizationInterceptor: HttpInterceptorFn = (req, next) => {

  if(!urlsAuthorization.includes(req.url)) return next(req);

  return next(req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
  }))
};
