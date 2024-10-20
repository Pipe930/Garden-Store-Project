import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ResponseProduct, ResponseProducts } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ResponseCategories } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly _http = inject(HttpClient);
  private products = new BehaviorSubject<Product[]>([]);
  public products$ = this.products.asObservable();
  private urlApiProducts = `${environment.api}/products`;
  private urlApiCategories = `${environment.api}/categories`;

  public getAllProducts(page: number): void{
    this._http.get<ResponseProducts>(this.urlApiProducts, {
      params: {
        page: page.toString()
      }
    }).subscribe(result => {
      this.products.next(result.data);
    });
  }

  public searchProduct(title: string, category: string): void{
    this._http.get<ResponseProducts>(this.urlApiProducts, {
      params: {
        title,
        category
      }
    }).subscribe(result => {
      this.products.next(result.data);
    });
  }

  public getAllCategories():Observable<ResponseCategories>{
    return this._http.get<ResponseCategories>(this.urlApiCategories);
  }

  public getProduct(slug: string):Observable<ResponseProduct>{
    return this._http.get<ResponseProduct>(`${this.urlApiProducts}/product/detail/${slug}`);
  }

  public getProductsFilterCategory(id_category: number):Observable<ResponseProducts>{
    return this._http.get<ResponseProducts>(`${this.urlApiProducts}/category/${id_category}`);
  }
}
