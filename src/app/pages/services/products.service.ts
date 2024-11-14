import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Product, ResponseProduct, ResponseProducts } from '../interfaces/product';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { environment } from '@env/environment.development';
import { ResponseCategories } from '@pages/interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly _http = inject(HttpClient);
  private products = new BehaviorSubject<Product[]>([]);
  public products$ = this.products.asObservable();
  public nextPage = false;
  public prevPage = false;
  private urlApiProducts = `${environment.api}/products`;
  private urlApiCategories = `${environment.api}/categories`;

  public getAllProducts():void {
    this._http.get<ResponseProducts>(this.urlApiProducts).subscribe(result => {
      this.products.next(result.data);
      this.validPage(result.totalPages, result.currentPage);
    });
  }

  public getProductsPage(page: number):void {

    this._http.get<ResponseProducts>(this.urlApiProducts,{
      params: {
        page: page.toString()
      }
    }).subscribe(result => {
      this.products.next(result.data);
      this.validPage(result.totalPages, result.currentPage);
    });
  }

  public searchProduct(title: string, category: string):void {
    this._http.get<ResponseProducts>(`${this.urlApiProducts}/search`, {
      params: {
        title,
        category
      }
    }).pipe(
      catchError(error => {
      if(error.status === HttpStatusCode.NotFound) this.products.next([]);
      return of();
    }
      )
    ).subscribe(result => {
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

  public getAllProductsOffer():Observable<ResponseProducts>{
    return this._http.get<ResponseProducts>(`${this.urlApiProducts}/offer`);
  }

  private validPage(totalPages: number, currentPage: number):void{

    if(currentPage === totalPages){
      this.nextPage = true;
    } else {
      this.nextPage = false;
    }

    if(currentPage === 1 || !currentPage){
      this.prevPage = true;
    } else {
      this.prevPage = false;
    }
  }
}
