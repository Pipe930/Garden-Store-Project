import { CreateUserForm, UpdateUserForm, UserInterface, UserListResponse, UserResponse } from '@admin/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/users`;

  public getAllUsers(): Observable<UserListResponse>{
    return this._http.get<UserListResponse>(this.urlApi);
  }

  public createUser(user: CreateUserForm): Observable<any>{
    return this._http.post<any>(this.urlApi, user);
  }

  public getUser(id: string): Observable<UserResponse>{
    return this._http.get<UserResponse>(`${this.urlApi}/${id}`);
  }

  public updateUser(id: string, user: UpdateUserForm): Observable<any>{
    return this._http.put<any>(`${this.urlApi}/${id}`, user);
  }
}
