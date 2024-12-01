import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseConfirmTransbank, ResponseTransbank, TransationTransbank } from '@pages/interfaces/transbank';

@Injectable({
  providedIn: 'root'
})
export class TransbankService {

  private readonly _http = inject(HttpClient);
  private urlApi = `${environment.api}/sales/`;

  public createTransationTransbank(transation: TransationTransbank):Observable<ResponseTransbank>{
    return this._http.post<ResponseTransbank>(`${this.urlApi}transbank/create`, transation)
  }

  public confirmTransationTransbank(token: string):Observable<ResponseConfirmTransbank>{
    return this._http.get<ResponseConfirmTransbank>(`${this.urlApi}transbank/commit/${token}`);
  }
}
