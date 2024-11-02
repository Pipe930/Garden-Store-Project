import { Branch } from '@admin/interfaces/branch';
import { BranchService } from '@admin/services/branch.service';
import { EmployeeService } from '@admin/services/employee.service';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GendersEnum } from '@core/enums/genders.enum';
import { AlertService } from '@core/services/alert.service';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.scss'
})
export class UpdateEmployeeComponent {

  private readonly _employeeService = inject(EmployeeService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);
  private readonly _branchService = inject(BranchService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public listBranchs = signal<Branch[]>([]);
  public listGenders = signal<GendersEnum[]>(Object.values(GendersEnum));
  private idEmployee = this._activatedRoute.snapshot.params["id"];


  public updateEmployeeForm: FormGroup = this._builder.group({
    firstName: this._builder.control("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    lastName: this._builder.control("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this._builder.control("", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    gender: this._builder.control("", Validators.required),
    rut: this._builder.control("", [Validators.required, Validators.pattern(/^\d{8}-[\dkK]$/)]),
    birthday: this._builder.control("", Validators.required),
    dateContract: this._builder.control("", Validators.required),
    salary: this._builder.control(200000, [Validators.required, Validators.min(200000)]),
    condition: this._builder.control("", Validators.required),
    idBranch: this._builder.control("", Validators.required)
  });

  ngOnInit(): void {

    this._branchService.getAllBranchs().subscribe((response) => {
      this.listBranchs.set(response.data);
    });

    this._employeeService.getEmployee(this.idEmployee).subscribe((response) => {

      this.updateEmployeeForm.get("firstName")?.setValue(response.data.firstName);
      this.updateEmployeeForm.get("lastName")?.setValue(response.data.lastName);
      this.updateEmployeeForm.get("email")?.setValue(response.data.email);
      this.updateEmployeeForm.get("phone")?.setValue(response.data.phone.split('+569')[1]);
      this.updateEmployeeForm.get("gender")?.setValue(response.data.gender);
      this.updateEmployeeForm.get("rut")?.setValue(response.data.rut);
      this.updateEmployeeForm.get("birthday")?.setValue(new Date(response.data.birthday).toISOString().split('T')[0]);
      this.updateEmployeeForm.get("dateContract")?.setValue(new Date(response.data.dateContract).toISOString().split('T')[0]);
      this.updateEmployeeForm.get("salary")?.setValue(response.data.salary);
      this.updateEmployeeForm.get("condition")?.setValue(response.data.condition);
      this.updateEmployeeForm.get("idBranch")?.setValue(response.data.idBranch);
      this.updateEmployeeForm.updateValueAndValidity();
    });
  }

  public updateEmployee(): void {

    if (this.updateEmployeeForm.invalid) {
      this.updateEmployeeForm.markAllAsTouched();
      return;
    }

    if(this.updateEmployeeForm.value.phone.length === 8) this.updateEmployeeForm.value.phone = `+569${this.updateEmployeeForm.value.phone}`;
    this.updateEmployeeForm.value.idBranch = parseInt(this.updateEmployeeForm.value.idBranch);

    this._employeeService.updateEmployee(this.idEmployee, this.updateEmployeeForm.value).subscribe(() => {
      this._alertService.success("Empleado Creado", "El empleado ha sido creado correctamente");
      this._router.navigateByUrl("/admin/employees/list");
    });
  }

  get firstName() {
    return this.updateEmployeeForm.controls["firstName"];
  }

  get lastName() {
    return this.updateEmployeeForm.controls["lastName"];
  }

  get email() {
    return this.updateEmployeeForm.controls["email"];
  }

  get phone() {
    return this.updateEmployeeForm.controls["phone"];
  }

  get gender() {
    return this.updateEmployeeForm.controls["gender"];
  }

  get rut() {
    return this.updateEmployeeForm.controls["rut"];
  }

  get birthday() {
    return this.updateEmployeeForm.controls["birthday"];
  }

  get dateContract() {
    return this.updateEmployeeForm.controls["dateContract"];
  }

  get salary() {
    return this.updateEmployeeForm.controls["salary"];
  }

  get condition() {
    return this.updateEmployeeForm.controls["condition"];
  }

  get idBranch() {
    return this.updateEmployeeForm.controls["idBranch"];
  }

}
