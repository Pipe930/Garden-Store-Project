import { FileUpload } from '@admin/interfaces/image';
import { CreateProductForm, UpdateProductForm, ProductResponse, ProductsResponse } from '@admin/interfaces/product-table';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${environment.api}/products`;

  public getAllProducts():Observable<ProductsResponse>{
    return this._http.get<ProductsResponse>(`${this._baseUrl}?limit=10`);
  }

  public createProduct(product: CreateProductForm):Observable<ProductResponse>{
    return this._http.post<ProductResponse>(this._baseUrl, product);
  }

  public updateProduct(product: UpdateProductForm, id: number):Observable<any>{
    return this._http.put<any>(`${this._baseUrl}/product/${id}`, product);
  }

  public getProduct(id: number):Observable<ProductResponse>{
    return this._http.get<ProductResponse>(`${this._baseUrl}/product/${id}`);
  }

  public uploadImage(file: FileUpload):Observable<any>{
    return this._http.post<any>(`${this._baseUrl}/upload/image/product`, file);
  }

}
