import { BranchResponse, CreateBranch, CreateProductBranchForm, ListBranchResponse } from '@admin/interfaces/branch';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/branchs`;

  public getAllBranchs() :Observable<ListBranchResponse>{
    return this._http.get<ListBranchResponse>(this.urlApi);
  }

  public createBranch(branch: CreateBranch) :Observable<any>{
    return this._http.post<any>(this.urlApi, branch);
  }

  public getBranch(id: number): Observable<BranchResponse>{
    return this._http.get<BranchResponse>(`${this.urlApi}/${id}`);
  }

  public createStockBranch(stockBranch: CreateProductBranchForm): Observable<any>{
    return this._http.post(`${this.urlApi}/stock`, stockBranch);
  }
}
