import { CreatePermission, ListPermissionResponse, PermissionResponse } from '@admin/interfaces/permission';
import { CreateRole, ListRoleResponse, ResponseRole } from '@admin/interfaces/role';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/access-control`;

  public getAllRoles(): Observable<ListRoleResponse> {
    return this._http.get<ListRoleResponse>(`${this.urlApi}/roles`);
  }

  public getAllPermissions(): Observable<ListPermissionResponse> {
    return this._http.get<ListPermissionResponse>(`${this.urlApi}/permissions`);
  }

  public createPermission(formPermission: CreatePermission): Observable<any>{
    return this._http.post(`${this.urlApi}/permissions`, formPermission);
  }

  public createRole(formRole: CreateRole): Observable<any>{
    return this._http.post(`${this.urlApi}/roles`, formRole);
  }

  public getPermission(id:number): Observable<PermissionResponse>{
    return this._http.get<PermissionResponse>(`${this.urlApi}/permissions/${id}`);
  }

  public getRole(id:number): Observable<ResponseRole>{
    return this._http.get<ResponseRole>(`${this.urlApi}/roles/${id}`);
  }

  public updatePermission(id:number, formPermission: CreatePermission): Observable<any>{
    return this._http.put(`${this.urlApi}/permissions/${id}`, formPermission);
  }

  public updateRole(id:number, formRole: CreateRole): Observable<any>{
    return this._http.put(`${this.urlApi}/roles/${id}`, formRole);
  }
}
