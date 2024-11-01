import { CreateSupplier, ListSuppliersResponse, SupplierResponse } from '@admin/interfaces/supplier';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/suppliers`;

  public getAllSuppliers(): Observable<ListSuppliersResponse> {
    return this._http.get<ListSuppliersResponse>(this.urlApi);
  }

  public createSupplier(supplier: CreateSupplier): Observable<any> {
    return this._http.post(this.urlApi, supplier);
  }

  public getSupplier(id: number): Observable<SupplierResponse> {
    return this._http.get<SupplierResponse>(`${this.urlApi}/${id}`);
  }

  public updateSupplier(id: number, supplier: CreateSupplier): Observable<any> {
    return this._http.put(`${this.urlApi}/${id}`, supplier);
  }
}
