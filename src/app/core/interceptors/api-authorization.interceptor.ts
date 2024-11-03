import { HttpInterceptorFn } from '@angular/common/http';

export const apiAuthorizationInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
  }))
};
