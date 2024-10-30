import { AddressAdmin, AddressAdminResponse, CreateAddress, ListAddressResponse } from '@admin/interfaces/addressAdmin';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressAdminService {

  public urlApi = `${environment.api}/address`;
  private readonly _http = inject(HttpClient);
  private listAddressAdmin = new BehaviorSubject<AddressAdmin[]>([]);
  public listAddressAdmin$ = this.listAddressAdmin.asObservable();

  public getAllAddress(): void {
    this._http.get<ListAddressResponse>(this.urlApi).subscribe(response => {
      this.listAddressAdmin.next(response.data);
    });
  }

  public createAddress(addressForm: CreateAddress): Observable<any> {
    return this._http.post(this.urlApi, addressForm);
  }

  public getAddress(id: number): Observable<AddressAdminResponse> {
    return this._http.get<AddressAdminResponse>(`${this.urlApi}/${id}`);
  }
}
