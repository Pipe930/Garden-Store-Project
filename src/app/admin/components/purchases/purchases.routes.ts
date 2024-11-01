import { Routes } from '@angular/router';
import { ListPurchasesComponent } from './list-purchases/list-purchases.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { DetailPurchaseComponent } from './detail-purchase/detail-purchase.component';

export const routesPurchases: Routes = [

  {
    path: "list",
    component: ListPurchasesComponent
  },
  {
    path: "create",
    component: CreatePurchaseComponent
  },
  {
    path: "detail/:id",
    component: DetailPurchaseComponent
  }
];
