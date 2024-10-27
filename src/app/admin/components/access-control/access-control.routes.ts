import { Routes } from '@angular/router';
import { ListAccessControlComponent } from './list-access-control/list-access-control.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
import { UpdatePermissionComponent } from './update-permission/update-permission.component';

export const routesAccessControl: Routes = [

  {
    path: "list",
    component: ListAccessControlComponent
  },
  {
    path: "role/create",
    component: CreateRoleComponent
  },
  {
    path: "permission/create",
    component: CreatePermissionComponent
  },
  {
    path: "permission/edit/:id",
    component: UpdatePermissionComponent
  }
];
