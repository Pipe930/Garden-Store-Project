import { Routes } from '@angular/router';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';

export const routesCategories: Routes = [

  {
    path: "list",
    component: ListCategoriesComponent
  },
  {
    path: "create",
    component: CreateCategoryComponent
  },
  {
    path: "edit/:id",
    component: UpdateCategoryComponent
  }
];
