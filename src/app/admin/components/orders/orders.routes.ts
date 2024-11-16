import { Routes } from '@angular/router';
import { ListOrdersComponent } from './list-orders/list-orders.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';

export const routesOrders: Routes = [

  {
    path: "list",
    component: ListOrdersComponent
  },
  // {
  //   path: "create",
  //   component: CreateSupplierComponent
  // },
  {
    path: "detail/:id",
    component: DetailOrderComponent
  }
];
