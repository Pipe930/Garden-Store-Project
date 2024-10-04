import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: "",
    loadChildren: () => import("./pages/pages.routes").then(m => m.routesPages)
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.routes").then(m => m.routesAuth)
  }
];
