import { ListOrderResponse, OrderResponse, OrderUpdate } from '@admin/interfaces/order';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly _http = inject(HttpClient);
  private readonly urlApi = `${environment.api}/orders`;

  public getAllOrders(): Observable<ListOrderResponse> {
    return this._http.get<ListOrderResponse>(this.urlApi);
  }

  public getOrderById(id: number): Observable<OrderResponse> {
    return this._http.get<OrderResponse>(`${this.urlApi}/${id}`);
  }

  public updateOrder(id: number, body: OrderUpdate): Observable<any> {
    return this._http.put(`${this.urlApi}/${id}`, body);
  }
}
