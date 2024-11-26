import { ListSaleResponse, SaleResponse } from '@admin/interfaces/sale';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales`;

  public getSale(code: string): Observable<SaleResponse> {
    return this._http.get<SaleResponse>(`${this.urlApi}/detail/${code}`);
  }

  public getAllSales(): Observable<ListSaleResponse> {
    return this._http.get<ListSaleResponse>(this.urlApi);
  }

  public analyzeSale(code: string): Observable<any> {
    return this._http.get(`${this.urlApi}/analytics/${code}`);
  }

  public generatePDF(idSale: string, timeAnalytics: string, result: number): Observable<any> {
    return this._http.post(`${this.urlApi}/generatePDF`, { idSale, timeAnalytics, result }, { responseType: 'blob' });
  }
}
