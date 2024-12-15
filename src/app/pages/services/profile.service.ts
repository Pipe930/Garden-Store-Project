import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { ChangePasswordForm, Profile, profileJson, ResponseProfile } from '@pages/interfaces/profile';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/auth`;
  private profileUser = new BehaviorSubject<Profile>(profileJson);
  public profileUser$ = this.profileUser.asObservable();

  public getProfileUser(): void{
    this._http.get<ResponseProfile>(`${this.urlApi}/profile`).subscribe(response => {
      this.profileUser.next(response.data);
    });
  }

  public updateProfileUser(profile: Profile): Observable<any>{
    return this._http.put(`${this.urlApi}/profile`, profile);
  }

  public changePassword(changePasswordForm: ChangePasswordForm): Observable<any>{
    return this._http.post(`${this.urlApi}/change-password`, changePasswordForm);
  }

  public deleteAccount(password: string): Observable<any>{
    return this._http.post(`${this.urlApi}/delete/account`, password);
  }

}
