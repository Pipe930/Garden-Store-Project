import { Branch } from '@admin/interfaces/branch';
import { BranchService } from '@admin/services/branch.service';
import { EmployeeService } from '@admin/services/employee.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GendersEnum } from '@core/enums/genders.enum';
import { AlertService } from '@core/services/alert.service';


@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss'
})
export class CreateEmployeeComponent implements OnInit {

  private readonly _employeeService = inject(EmployeeService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);
  private readonly _branchService = inject(BranchService)

  public listBranchs = signal<Branch[]>([]);
  public listGenders = signal<GendersEnum[]>(Object.values(GendersEnum));

  public createEmployeeForm: FormGroup = this._builder.group({
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
  }

  public createEmployee(): void {

    if (this.createEmployeeForm.invalid) {
      this.createEmployeeForm.markAllAsTouched();
      return;
    }

    if(this.createEmployeeForm.value.phone.length === 8) this.createEmployeeForm.value.phone = `+569${this.createEmployeeForm.value.phone}`;
    this.createEmployeeForm.value.idBranch = parseInt(this.createEmployeeForm.value.idBranch);

    this._employeeService.createEmployee(this.createEmployeeForm.value).subscribe(() => {
      this._alertService.success("Empleado Creado", "El empleado ha sido creado correctamente");
      this._router.navigateByUrl("/admin/employees/list");
    });
  }

  get firstName() {
    return this.createEmployeeForm.controls["firstName"];
  }

  get lastName() {
    return this.createEmployeeForm.controls["lastName"];
  }

  get email() {
    return this.createEmployeeForm.controls["email"];
  }

  get phone() {
    return this.createEmployeeForm.controls["phone"];
  }

  get gender() {
    return this.createEmployeeForm.controls["gender"];
  }

  get rut() {
    return this.createEmployeeForm.controls["rut"];
  }

  get birthday() {
    return this.createEmployeeForm.controls["birthday"];
  }

  get dateContract() {
    return this.createEmployeeForm.controls["dateContract"];
  }

  get salary() {
    return this.createEmployeeForm.controls["salary"];
  }

  get condition() {
    return this.createEmployeeForm.controls["condition"];
  }

  get idBranch() {
    return this.createEmployeeForm.controls["idBranch"];
  }

}
