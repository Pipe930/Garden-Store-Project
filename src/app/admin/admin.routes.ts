import { Routes } from '@angular/router';

export const routesAdmin: Routes = [

  {
    path: "",
    loadComponent: () => import("./admin.component").then(c => c.AdminComponent),
    children: [
    ]
  }
];
