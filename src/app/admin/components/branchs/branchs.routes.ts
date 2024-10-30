import { Routes } from '@angular/router';
import { ListBranchsComponent } from './list-branchs/list-branchs.component';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { UpdateBranchComponent } from './update-branch/update-branch.component';

export const routesBranchs: Routes = [

  {
    path: "list",
    component: ListBranchsComponent
  },
  {
    path: "create",
    component: CreateBranchComponent
  },
  {
    path: "edit/:id",
    component: UpdateBranchComponent
  }
];
