import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cart, cartJson, FormAddCart, FormRemoveCart, ResponseCart } from '../interfaces/cart';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private urlApiCart = `${environment.api}/cart`;
  private readonly _http = inject(HttpClient);

  private cartCurrent = new BehaviorSubject<Cart>(cartJson);
  public cartCurrent$ = this.cartCurrent.asObservable();
  public isLoading = new Subject<boolean>();

  public getCartUser():void{
    this._http.get<ResponseCart>(`${this.urlApiCart}/user`).subscribe(result => {
      this.cartCurrent.next(result.data);
      this.isLoading.next(true);
    });
  }

  public addProductCart(form: FormAddCart):Observable<ResponseCart>{
    return this._http.post<ResponseCart>(`${this.urlApiCart}/add/item`, form);
  }

  public substractProductCart(form: FormRemoveCart):Observable<any>{
    return this._http.post<any>(`${this.urlApiCart}/substract/item`, form)
  }

  public removeProductCart(id_product: number):Observable<any>{
    return this._http.delete<any>(`${this.urlApiCart}/remove/item/${id_product}`)
  }

  public clearCart():Observable<any>{
    return this._http.delete<any>(`${this.urlApiCart}/clear`);
  }
}
