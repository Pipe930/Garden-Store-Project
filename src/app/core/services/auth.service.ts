import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login, LoginResponse, RefreshTokenResponse } from '../interfaces/login';
import { Registro } from '../interfaces/register';
import { Profile, ResponseProfile } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly urlApi = `${environment.api}/auth`;

  constructor(private readonly http: HttpClient) {}

  public login(loginForm: Login): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.urlApi}/login`, loginForm).pipe(
      map((response) => {

        if(response && 'accessToken' in response.data && 'refreshToken' in response.data){
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response;
      })
    );;
  }

  public profile(): Observable<ResponseProfile>{
    return this.http.get<ResponseProfile>(`${this.urlApi}/profile`);
  }

  public updateProfile(updateProfile: Profile): Observable<any>{
    return this.http.put(`${this.urlApi}/profile`, updateProfile);
  }

  public register(registerForm: Registro): Observable<any>{
    return this.http.post(`${this.urlApi}/register`, registerForm);
  }

  public refreshToken():Observable<RefreshTokenResponse>{
    return this.http.post<RefreshTokenResponse>(`${this.urlApi}/refresh-token`, {
      refreshToken: sessionStorage.getItem('refreshToken')
    })
  }

  public logout():Observable<any>{
    return this.http.get(`${this.urlApi}/logout`);
  }
}
