import { CreatePurchase, ListPurchaseResponse } from '@admin/interfaces/purchase';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/purchases`;

  public getAllPurchase(): Observable<ListPurchaseResponse>{
    return this._http.get<ListPurchaseResponse>(this.urlApi);
  }

  public createPurchase(formPurchase: CreatePurchase): Observable<any> {
    return this._http.post(this.urlApi, formPurchase);
  }
}
