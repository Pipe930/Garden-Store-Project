import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './components/home/home.component';

export const routesPages: Routes = [

  {
    path: "",
    component: PagesComponent,
    children: [

      {
        path: "",
        component: HomeComponent
      }
    ]
  }
];
