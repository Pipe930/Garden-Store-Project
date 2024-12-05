import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (!sessionStorage.getItem('accessToken')) return next(req);

  return next(req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
  }))
};
