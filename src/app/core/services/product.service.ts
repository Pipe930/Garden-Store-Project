import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ResponseListProducts, ResponseProduct } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api}/products`;
  private listProducts = new BehaviorSubject<Product[]>([]);
  public listProducts$ = this.listProducts.asObservable();

  public getProducts(): void {
    this.http.get<ResponseListProducts>(this.apiUrl).subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listProducts.next(response.data);

      this.listProducts.next([]);
    });
  }

  public getProductById(productSlug: string): Observable<ResponseProduct> {
    return this.http.get<ResponseProduct>(`${this.apiUrl}/product/detail/${productSlug}`);
  }

  public searchProduct(title: string): void {
    this.http.get<ResponseListProducts>(`${this.apiUrl}/search?title=${title}&category=0`).subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listProducts.next(response.data);

      this.listProducts.next([]);
    });
  }

  public getProuctsByCategory(idCategory: number): Observable<ResponseListProducts> {
    return this.http.get<ResponseListProducts>(`${this.apiUrl}/category/${idCategory}`);
  }

}
