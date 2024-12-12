import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateSubcription, ResponseSubcription, Subcription, subcriptionObject } from '@pages/interfaces/subcription';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcriptionService {

  private readonly _http = inject(HttpClient);
  private urlApi = `${environment.api}/subscriptions`;
  private subcription = new BehaviorSubject<Subcription>(subcriptionObject);
  public subcription$ = this.subcription.asObservable();

  public createSubcription(form: CreateSubcription):Observable<any>{
    return this._http.post(this.urlApi, form);
  }

  public getSubcription():void{
    this._http.get<ResponseSubcription>(`${this.urlApi}/subscription`).subscribe(result => {
      this.subcription.next(result.data);
    })
  }

  public cancelSubcription():Observable<any>{
    return this._http.get(`${this.urlApi}/subscription/remove`);
  }

  public renovateSubcription(formRenovate: CreateSubcription): Observable<any> {
    return this._http.put(`${this.urlApi}/subscription/renovate`, formRenovate);
  }
}
