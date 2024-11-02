import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateVoucher, ResponseListUserPurchase, UpdateVoucher } from '@pages/interfaces/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales`;

  public createPurchase(voucher: CreateVoucher): Observable<any> {
    return this._http.post(`${this.urlApi}`, voucher);
  }

  public getAllPurchasesUser(): Observable<ResponseListUserPurchase> {
    return this._http.get<ResponseListUserPurchase>(`${this.urlApi}/user`);
  }

  public updateStatusPurchase(idSale: number, updateSale: UpdateVoucher): Observable<any> {
    return this._http.put(`${this.urlApi}/status/${idSale}`, updateSale);
  }
}
