import { HttpInterceptorFn } from '@angular/common/http';
import { validUrl } from '../utils/urls-api';

export const apiAuthorizationInterceptor: HttpInterceptorFn = (req, next) => {

  if(!validUrl(req)) return next(req);

  return next(req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
  }))
};
