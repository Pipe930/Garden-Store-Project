import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormRegister, RegisterResponse } from '@auth/interfaces/register';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment.development';
import { FormLogin, LoginAdminResponse, LoginResponse, RefreshTokenResponse } from '@auth/interfaces/login';
import { ForgotPasswordResponse, FormForgotPassword, FormForgotPasswordConfirm } from '@auth/interfaces/forgot-password';
import { ActivateAccountInterface, ResponseActivateAccount } from '@auth/interfaces/activate';
import { VerifyOTPInterface } from '@admin/interfaces/user';

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

        if(response && 'accessToken' in response.data && 'refreshToken' in response.data){
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response;
      })
    );
  }

  public verifyOTP(verifyOtp: VerifyOTPInterface):Observable<LoginResponse>{
    return this._http.post<LoginResponse>(`${this.urlApi}/verifyOTP`, verifyOtp)    .pipe(
      map((response) => {

        if(response && 'accessToken' in response.data && 'refreshToken' in response.data){
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response;
      })
    );;
  }

  public forgotPassword(formForgotPassword: FormForgotPassword): Observable<ForgotPasswordResponse>{
    return this._http.post<ForgotPasswordResponse>(`${this.urlApi}/forgot-password`, formForgotPassword);
  }

  public forgotPasswordConfirm(formForgotPasswordConfirm: FormForgotPasswordConfirm): Observable<ForgotPasswordResponse>{
    return this._http.post<ForgotPasswordResponse>(`${this.urlApi}/forgot-password/confirm`, formForgotPasswordConfirm);
  }

  public activateAccount(body: ActivateAccountInterface):Observable<ResponseActivateAccount>{
    return this._http.post<ResponseActivateAccount>(`${this.urlApi}/activate/account`, body);
  }

  public refreshToken():Observable<RefreshTokenResponse>{
    return this._http.post<RefreshTokenResponse>(`${this.urlApi}/refresh-token`, {
      refreshToken: sessionStorage.getItem('refreshToken')
    })
  }

  public logout():Observable<any>{
    return this._http.get(`${this.urlApi}/logout`);
  }
}
