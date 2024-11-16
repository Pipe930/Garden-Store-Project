import { columnsOrders, Order } from '@admin/interfaces/order';
import { OrderService } from '@admin/services/order.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-orders',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.scss'
})
export class ListOrdersComponent implements OnInit {

  private readonly _orderService = inject(OrderService);
  private readonly _router = inject(Router);
  public listOrders = signal<Order[]>([]);
  public columnsOrder = signal<TableColumns[]>(columnsOrders);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this._orderService.getAllOrders().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listOrders.set(response.data);
      this.isLoading.set(false);
    });
  }

  public editOrder(order: Order): void {
    this._router.navigate(['admin/orders/detail', order.idShippingSale]);
  }

}
