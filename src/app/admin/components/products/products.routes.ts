import { Routes } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';

export const routesProducts: Routes = [

  {
    path: "list",
    component: ListProductsComponent
  },
  {
    path: "create",
    component: CreateProductComponent
  },
  {
    path: "edit/:id",
    component: UpdateProductComponent
  }
];
