import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ResponseProduct, ResponseProducts } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ResponseCategories } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly _http = inject(HttpClient);
  private urlApiProducts: string = `${environment.api}/products`;
  private urlApiCategories: string = `${environment.api}/categories`;

  public getAllProducts():Observable<ResponseProducts>{
    return this._http.get<ResponseProducts>(this.urlApiProducts);
  }

  public getAllCategories():Observable<ResponseCategories>{
    return this._http.get<ResponseCategories>(this.urlApiCategories);
  }

  public getProduct(slug: string):Observable<ResponseProduct>{
    return this._http.get<ResponseProduct>(`${this.urlApiProducts}/product/${slug}`);
  }

  public getProductsFilterCategory(id_category: number):Observable<ResponseProducts>{
    return this._http.get<ResponseProducts>(`${this.urlApiProducts}/category/${id_category}`);
  }
}
