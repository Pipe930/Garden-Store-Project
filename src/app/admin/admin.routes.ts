import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routesAdmin: Routes = [

  {
    path: "",
    loadComponent: () => import("./admin.component").then(c => c.AdminComponent),
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "categories",
        loadChildren: () => import("./components/categories/categories.routes").then(m => m.routesCategories)
      },
      {
        path: "products",
        loadChildren: () => import('./components/products/products.routes').then(m => m.routesProducts)
      },
      {
        path: "offers",
        loadChildren: () => import('./components/offers/offers.routes').then(m => m.routesOffers)
      },
      {
        path: "users",
        loadChildren: () => import('./components/users/users.routes').then(m => m.routesUsers)
      },
      {
        path: "access-control",
        loadChildren: () => import('./components/access-control/access-control.routes').then(m => m.routesAccessControl)
      },
      {
        path: "branchs",
        loadChildren: () => import('./components/branchs/branchs.routes').then(m => m.routesBranchs)
      },
      {
        path: "purchases",
        loadChildren: () => import('./components/purchases/purchases.routes').then(m => m.routesPurchases)
      },
      {
        path: "suppliers",
        loadChildren: () => import('./components/suppliers/suppliers.routes').then(m => m.routesSuppliers)
      },
      {
        path: "employees",
        loadChildren: () => import('./components/employees/employees.routes').then(m => m.routesEmployees)
      }
    ]
  }
];
