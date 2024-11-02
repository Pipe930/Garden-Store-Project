import { columnsEmployee, Employee } from '@admin/interfaces/employee';
import { EmployeeService } from '@admin/services/employee.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-employees',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-employees.component.html',
  styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent implements OnInit {

  private readonly _employeeService = inject(EmployeeService);
  private readonly _router = inject(Router);

  public listEmployees = signal<Employee[]>([]);
  public columnsEmployee = signal<TableColumns[]>(columnsEmployee);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this._employeeService.getAllEmployees().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listEmployees.set(response.data);
      this.isLoading.set(false);
    });
  }

  public editEmployee(employee: Employee): void {
    this._router.navigate(['admin/employees/edit', employee.idEmployee]);
  }

}
