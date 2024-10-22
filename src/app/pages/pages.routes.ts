import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { authenticationGuard } from '../core/guards/authentication.guard';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PurchaseConfirmComponent } from './components/purchase-confirm/purchase-confirm.component';

export const routesPages: Routes = [

  {
    path: "",
    loadComponent: () => import("./pages.component").then(c => c.PagesComponent),
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
      },
      {
        path: "cart",
        component: CartComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "purchase",
        component: PurchaseComponent,
        canActivate: [authenticationGuard]
      },
      {
        path: "purchase-confirm",
        component: PurchaseConfirmComponent,
        canActivate: [authenticationGuard]
      }
    ]
  }
];
