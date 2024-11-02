import { CreateEmployee, EmployeeResponse, ListEmployeesResponse } from '@admin/interfaces/employee';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/branchs`;

  public getAllEmployees(): Observable<ListEmployeesResponse>{
    return this._http.get<ListEmployeesResponse>(`${this.urlApi}/employees`);
  }

  public createEmployee(employee: CreateEmployee): Observable<any>{
    return this._http.post(`${this.urlApi}/employees`, employee);
  }

  public getEmployee(id: number): Observable<EmployeeResponse>{
    return this._http.get<EmployeeResponse>(`${this.urlApi}/employee/${id}`);
  }

  public updateEmployee(id: number, employee: CreateEmployee): Observable<any>{
    return this._http.put(`${this.urlApi}/employee/${id}`, employee);
  }
}
