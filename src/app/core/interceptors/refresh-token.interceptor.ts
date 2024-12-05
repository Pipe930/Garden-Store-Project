import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, concatMap, EMPTY, Subject, throwError } from 'rxjs';

let refreshTokenInProgress = false;
let refreshTokenSubject: Subject<string | null> = new Subject<string | null>();

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if(req.url.includes('auth/login')) return next(req);

      if (error.status === HttpStatusCode.Unauthorized) {

        if (!refreshTokenInProgress) {

          refreshTokenInProgress = true;
          return authService.refreshToken().pipe(
            concatMap((response) => {

              sessionStorage.setItem('accessToken', response.data.accessToken);
              sessionStorage.setItem('refreshToken', response.data.refreshToken);

              refreshTokenSubject.next(response.data.accessToken);

              refreshTokenInProgress = false;
              refreshTokenSubject = new Subject<string | null>();

              return next(req.clone({
                setHeaders: {
                  Authorization: "Bearer " + response.data.accessToken
                }
              }));
            }),
            catchError(() => {

              refreshTokenInProgress = false;
              refreshTokenSubject = new Subject<string | null>();
              sessionStorage.clear();
              router.navigate(["auth/login"]);
              return EMPTY;
            })
          );
        }

        return refreshTokenSubject.pipe(
          concatMap((newToken) => {
            if (newToken) {

              return next(req.clone({
                setHeaders: {
                  Authorization: "Bearer " + newToken
                }
              }));
            }

            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
