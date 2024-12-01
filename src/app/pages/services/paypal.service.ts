import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CommitPaypal, PaypalCreate, ResponsePaypalCreate } from '@pages/interfaces/paypal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales`;

  public createPaypal(paypalCreate: PaypalCreate): Observable<ResponsePaypalCreate> {
    return this._http.post<ResponsePaypalCreate>(`${this.urlApi}/paypal/create`, paypalCreate);
  }

  public commitPaypal(commitPaypal: CommitPaypal): Observable<any> {
    return this._http.post(`${this.urlApi}/paypal/commit`, commitPaypal);
  }
}
