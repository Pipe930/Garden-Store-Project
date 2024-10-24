import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: "",
    loadChildren: () => import("./pages/pages.routes").then(m => m.routesPages)
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.routes").then(m => m.routesAuth)
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.routes").then(m => m.routesAdmin)
  },
  {
    path: "admin/loginAdmin",
    loadComponent: () => import("./admin/components/login-admin/login-admin.component").then(c => c.LoginAdminComponent)
  }
];
