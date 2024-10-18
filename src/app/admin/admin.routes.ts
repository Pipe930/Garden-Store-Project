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
      }
    ]
  }
];