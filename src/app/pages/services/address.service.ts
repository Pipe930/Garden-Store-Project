import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ListResponseCommune, ListResponseProvince, ListResponseRegion, ResponseCommune, ResponseProvince, ResponseRegion } from '../interfaces/locates';
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

  public getProvinceRegion(code: number):Observable<ListResponseProvince>{
    return this._http.get<ListResponseProvince>(`${this.urlApi}provinces/${code}`);
  }

  public getProvinceCommune(code: number):Observable<ListResponseCommune>{
    return this._http.get<ListResponseCommune>(`${this.urlApi}communes/${code}`);
  }

  public getRegion(idRegion: number):Observable<ResponseRegion>{
    return this._http.get<ResponseRegion>(`${this.urlApi}region/${idRegion}`);
  }

  public getProvince(idProvince: number):Observable<ResponseProvince>{
    return this._http.get<ResponseProvince>(`${this.urlApi}province/${idProvince}`);
  }

  public getCommune(idCommune: number):Observable<ResponseCommune>{
    return this._http.get<ResponseCommune>(`${this.urlApi}commune/${idCommune}`);
  }

  public getAllAddress():void {
    this._http.get<ListAddress>(`${this.urlApi}user`).subscribe(result => {
      this.listAddress.next(result.data);
    });
  }

  public createAddress(form: CreateAddress):Observable<any>{
    return this._http.post<any>(`${this.urlApi}user`, form)
  }

  public deleteAddress(idAddress: number):Observable<any>{
    return this._http.delete<any>(`${this.urlApi}user/${idAddress}`);
  }

  public updateAddress(idAddress: number, form: CreateAddress):Observable<any>{
    return this._http.put<any>(`${this.urlApi}user/${idAddress}`, form)
  }

  public getAddress(idAddress: number):Observable<ResponseAddress>{
    return this._http.get<ResponseAddress>(`${this.urlApi}user/${idAddress}`)
  }
}
