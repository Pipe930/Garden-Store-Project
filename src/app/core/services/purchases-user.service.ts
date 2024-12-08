import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListPurchaseResponse, PurchaseResonse } from '../interfaces/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchasesUserService {

  private readonly http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales`;

  public getPurchasesUser(): Observable<ListPurchaseResponse> {
    return this.http.get<ListPurchaseResponse>(`${this.urlApi}/user`);
  }

  public getPurchase(idSale: string): Observable<PurchaseResonse>{
    return this.http.get<PurchaseResonse>(`${this.urlApi}/detail/${idSale}`);
  }
}
