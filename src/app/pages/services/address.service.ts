import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ListResponseCommune, ListResponseProvince, ListResponseRegion } from '../interfaces/locates';
import { Address, CreateAddress, ListAddress, ResponseAddress } from '../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private readonly _http = inject(HttpClient);
  private urlApi = `${environment.api}/address/`;
  private listAddress = new BehaviorSubject<Array<Address>>([]);
  public listAddress$ = this.listAddress.asObservable();

  public getAllRegions():Observable<ListResponseRegion>{
    return this._http.get<ListResponseRegion>(`${this.urlApi}regions/`);
  }

  public getProvinceRegion(code: string):Observable<ListResponseProvince>{
    return this._http.get<ListResponseProvince>(`${this.urlApi}provinces/${code}`);
  }

  public getProvinceCommune(code: string):Observable<ListResponseCommune>{
    return this._http.get<ListResponseCommune>(`${this.urlApi}communes/${code}`);
  }

  public getAllAddress():void {
    this._http.get<ListAddress>(`${this.urlApi}user`).subscribe(result => {
      this.listAddress.next(result.data);
    });
  }

  public createAddress(form: CreateAddress):Observable<any>{
    return this._http.post<any>(`${this.urlApi}user`, form)
  }

  public deleteAddress(id_address: number):Observable<any>{
    return this._http.delete<any>(`${this.urlApi}address/${id_address}`);
  }

  public updateAddress(id_address: number, form: CreateAddress):Observable<any>{
    return this._http.put<any>(`${this.urlApi}address/${id_address}`, form)
  }

  public getAddress(id_address: number):Observable<ResponseAddress>{
    return this._http.get<any>(`${this.urlApi}address/${id_address}`)
  }
}
