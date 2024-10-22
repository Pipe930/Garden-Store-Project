import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateVoucher } from '@pages/interfaces/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales/`;

  public createPurchase(voucher: CreateVoucher): Observable<any> {
    return this._http.post<any>(`${this.urlApi}`, voucher);
  }
}
