import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchaseResponse } from '../interfaces/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchasesUserService {

  private readonly http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/sales`;

  public getPurchasesUser(): Observable<PurchaseResponse> {
    return this.http.get<PurchaseResponse>(`${this.urlApi}/user`);
  }
}
