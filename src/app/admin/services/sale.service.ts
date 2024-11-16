import { SaleResponse } from '@admin/interfaces/sale';
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
}
