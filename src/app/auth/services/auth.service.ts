import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormRegister, RegisterResponse } from '../interfaces/register';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { FormLogin, LoginResponse } from '../interfaces/login';
import { ForgotPasswordResponse, FormForgotPassword, FormForgotPasswordConfirm } from '../interfaces/forgot-password';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _http = inject(HttpClient);
  private urlApi: string = `${environment.api}/auth`;

  public register(formRegister: FormRegister): Observable<RegisterResponse>{
    return this._http.post<RegisterResponse>(`${this.urlApi}/register`, formRegister);
  }

  public login(formLogin: FormLogin): Observable<LoginResponse>{
    return this._http.post<LoginResponse>(`${this.urlApi}/login`, formLogin)
    .pipe(
      map((response) => {

        if(response && response.data.accessToken){
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return response;
      })
    );
  }

  public forgotPassword(formForgotPassword: FormForgotPassword): Observable<ForgotPasswordResponse>{
    return this._http.post<ForgotPasswordResponse>(`${this.urlApi}/forgot-password`, formForgotPassword);
  }

  public forgotPasswordConfirm(formForgotPasswordConfirm: FormForgotPasswordConfirm): Observable<ForgotPasswordResponse>{
    return this._http.post<ForgotPasswordResponse>(`${this.urlApi}/forgot-password/confirm`, formForgotPasswordConfirm);
  }
}
