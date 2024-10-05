import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './components/home/home.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routesPages: Routes = [

  {
    path: "",
    component: PagesComponent,
    children: [

      {
        path: "",
        component: HomeComponent
      },
      {
        path: "products",
        component: ListProductsComponent
      },
      {
        path: "product/:slug",
        component: ProductDetailComponent
      }
    ]
  }
];
