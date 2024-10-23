import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { validUrl } from '../utils/urls-api';

export const apiExceptionInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if(!validUrl(req)) return next(req);

      if(error.status === HttpStatusCode.Unauthorized){

        return authService.refreshToken().pipe(

          switchMap((result: any) => {

            sessionStorage.setItem('accessToken', result.data.accessToken);
            sessionStorage.setItem('refreshToken', result.data.refreshToken);

            return next(req.clone({

              setHeaders: {
                Authorization: "Bearer " + result.data.accessToken
              }
            })
          )
          }),
          catchError(() => {

            sessionStorage.clear();
            router.navigate(["auth/login"]);
            return EMPTY;
          })
        )
      }

      return throwError(() => error);
    })
  );
};
