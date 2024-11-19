import { Routes } from '@angular/router';
import { ListSalesComponent } from './list-sales/list-sales.component';
import { DetailSaleComponent } from './detail-sale/detail-sale.component';
import { ResultAnalyticsComponent } from './result-analytics/result-analytics.component';

export const routesSales: Routes = [
  {
    path: "list",
    component: ListSalesComponent
  },
  {
    path: "detail/:id",
    component: DetailSaleComponent
  },
  {
    path: "result-analysis/:id",
    component: ResultAnalyticsComponent
  }
];
