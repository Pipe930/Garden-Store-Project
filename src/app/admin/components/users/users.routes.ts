import { Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';

export const routesUsers: Routes = [
  {
    path: "list",
    component: ListUsersComponent
  },
  {
    path: "create",
    component: CreateUserComponent
  },
  {
    path: "edit/:id",
    component: UpdateUserComponent
  }
];
