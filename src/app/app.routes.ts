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
    path: "**",
    pathMatch: "full",
    loadComponent: () => import("./shared/page404/page404.component").then(m => m.Page404Component)
  }
];
