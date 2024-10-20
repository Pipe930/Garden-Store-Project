import { CreateOfferForm, ResponseOffer, ResponseOffers } from '@admin/interfaces/offer';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/offers`;

  public getAllOffers(): Observable<ResponseOffers>{
    return this._http.get<ResponseOffers>(this.urlApi);
  }

  public getOffer(id: number): Observable<ResponseOffer>{
    return this._http.get<ResponseOffer>(`${this.urlApi}/${id}`);
  }

  public createOffer(offer: CreateOfferForm): Observable<any>{
    return this._http.post<any>(this.urlApi, offer);
  }

  public updateOffer(id: number, offer: CreateOfferForm): Observable<any>{
    return this._http.put<any>(`${this.urlApi}/${id}`, offer);
  }
}
