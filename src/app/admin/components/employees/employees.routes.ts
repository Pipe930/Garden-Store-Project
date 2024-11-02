import { Routes } from '@angular/router';
import { ListEmployeesComponent } from './list-employees/list-employees.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './update-employee/update-employee.component';

export const routesEmployees: Routes = [
  {
    path: "list",
    component: ListEmployeesComponent
  },
  {
    path: "create",
    component: CreateEmployeeComponent
  },
  {
    path: "edit/:id",
    component: UpdateEmployeeComponent
  }
];
