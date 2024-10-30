import { AddressAdmin } from '@admin/interfaces/addressAdmin';
import { AddressAdminService } from '@admin/services/address-admin.service';
import { BranchService } from '@admin/services/branch.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-branch',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create-branch.component.html',
  styleUrl: './create-branch.component.scss'
})
export class CreateBranchComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _branchService = inject(BranchService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _addressAdminService = inject(AddressAdminService);

  public listAddress = signal<AddressAdmin[]>([]);

  public createBranchForm: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    tradeName: this._builder.control("", [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    postalCode: this._builder.control("", [Validators.required, Validators.pattern(/^[0-9]{7}$/)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)]),
    phone: this._builder.control("", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    openingDate: this._builder.control("", Validators.required),
    capacity: this._builder.control(10, [Validators.required, Validators.min(100)]),
    idAddress: this._builder.control("", Validators.required)
  });

  ngOnInit(): void {
    this._addressAdminService.getAllAddress();
    this._addressAdminService.listAddressAdmin$.subscribe(branch => {
      this.listAddress.set(branch);
    });
  }

  public createBranch(): void {

    if(this.createBranchForm.invalid) {
      this.createBranchForm.markAllAsTouched();
      return;
    }

    if(this.createBranchForm.value.phone.length === 8) this.createBranchForm.value.phone = `+569${this.createBranchForm.value.phone}`;
    this.createBranchForm.value.idAddress = parseInt(this.createBranchForm.value.idAddress);

    this._branchService.createBranch(this.createBranchForm.value).pipe(
      catchError((error) => {
        if(error.error.statusCode === HttpStatusCode.BadRequest) {
          this._alertService.error("Error al crear la sucursal", error.error.message);
        }
        return of();
      })
    ).subscribe(() => {
      this._alertService.success("Sucursal Creada", "La sucursal ha sido creada correctamente");
      this._router.navigate(["/admin/branchs/list"]);
    });
  }

  get name() {
    return this.createBranchForm.controls["name"];
  }

  get tradeName() {
    return this.createBranchForm.controls["tradeName"];
  }

  get postalCode() {
    return this.createBranchForm.controls["postalCode"];
  }

  get email() {
    return this.createBranchForm.controls["email"];
  }

  get phone() {
    return this.createBranchForm.controls["phone"];
  }

  get openingDate() {
    return this.createBranchForm.controls["openingDate"];
  }

  get capacity() {
    return this.createBranchForm.controls["capacity"];
  }

  get idAddress() {
    return this.createBranchForm.controls["idAddress"];
  }

}
