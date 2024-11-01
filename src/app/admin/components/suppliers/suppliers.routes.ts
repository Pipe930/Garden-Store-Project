import { Routes } from '@angular/router';
import { ListSuppliersComponent } from './list-suppliers/list-suppliers.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { UpdateSupplierComponent } from './update-supplier/update-supplier.component';

export const routesSuppliers: Routes = [

  {
    path: "list",
    component: ListSuppliersComponent
  },
  {
    path: "create",
    component: CreateSupplierComponent
  },
  {
    path: "update/:id",
    component: UpdateSupplierComponent
  }
];
