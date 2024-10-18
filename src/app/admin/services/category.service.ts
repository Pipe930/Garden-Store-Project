import { CategoriesResponse, CategoryForm, CategoryResponse } from '@admin/interfaces/category-table';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public urlApi = `${environment.api}/categories`;
  private readonly _http = inject(HttpClient);

  public getAllCategories(): Observable<CategoriesResponse> {
    return this._http.get<CategoriesResponse>(this.urlApi);
  }

  public createCategory(category: CategoryForm): Observable<any> {
    return this._http.post<any>(this.urlApi, category);
  }

  public updateCategory(category: CategoryForm, id: string): Observable<any> {
    return this._http.put<any>(`${this.urlApi}/${id}`, category);
  }

  public getCategoryById(id: string): Observable<CategoryResponse> {
    return this._http.get<CategoryResponse>(`${this.urlApi}/${id}`);
  }
}
