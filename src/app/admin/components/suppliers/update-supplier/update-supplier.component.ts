import { AddressAdmin } from '@admin/interfaces/addressAdmin';
import { CreateSupplier } from '@admin/interfaces/supplier';
import { AddressAdminService } from '@admin/services/address-admin.service';
import { SupplierService } from '@admin/services/supplier.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Commune, Province, Region } from '@pages/interfaces/locates';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './update-supplier.component.html',
  styleUrl: './update-supplier.component.scss'
})
export class UpdateSupplierComponent implements OnInit {

  private readonly _supplierService = inject(SupplierService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _addressAdminService = inject(AddressAdminService);

  public alertMessage = signal<boolean>(false);
  public calificationValue = signal<number>(0);
  public tooltipPosition = signal<number>(50);
  public tooltipVisible = signal<boolean>(false);
  private idSupplier = this._activatedRoute.snapshot.params["id"];

  public listRegions = signal<Region[]>([]);
  public listProvinces = signal<Province[]>([]);
  public listCommunes = signal<Commune[]>([]);
  public listAddress = signal<AddressAdmin[]>([]);

  public updateSupplierForm: FormGroup = this._builder.group({

    fullName: this._builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    rut: this._builder.control('', [Validators.required, Validators.pattern(/^\d{8}-[\dkK]$/)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: this._builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    idAddress: this._builder.control('', Validators.required)
  });

  ngOnInit(): void {

    this._addressAdminService.getAllAddress();
    this._addressAdminService.listAddressAdmin$.subscribe(address => {
      this.listAddress.set(address);
    })

    this._supplierService.getSupplier(this.idSupplier).subscribe((supplier) => {

      this.updateSupplierForm.get('fullName')?.setValue(supplier.data.fullName);
      this.updateSupplierForm.get('rut')?.setValue(supplier.data.rut);
      this.updateSupplierForm.get('phone')?.setValue(supplier.data.phone.split("+569")[1]);
      this.updateSupplierForm.get('email')?.setValue(supplier.data.email);
      this.updateSupplierForm.get('idAddress')?.setValue(supplier.data.idAddress);
      this.updateSupplierForm.updateValueAndValidity();
    });
  }

  public updateSupplier(): void {

    if (this.updateSupplierForm.invalid) {
      this.updateSupplierForm.markAllAsTouched();
      return;
    }

    if(this.updateSupplierForm.value.phone.length === 8) this.updateSupplierForm.value.phone = `+569${this.updateSupplierForm.value.phone}`;

    const { idAddress, ...formSupplier } = this.updateSupplierForm.value;

    const createSupplier: CreateSupplier = {
      ...formSupplier,
      idAddress: parseInt(idAddress)
    }

    this._supplierService.updateSupplier(this.idSupplier, createSupplier).pipe(
      catchError(error => {

        if(error.status === 409){
          this.alertMessage.set(true)
          return EMPTY;
        };
        this._alertService.error('Error', error.error.message);
        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success('Proveedor Creado', 'El proveedor ha sido creado correctamente');
      this._router.navigate(['/admin/suppliers/list']);

    });
  }


  get fullName() {
    return this.updateSupplierForm.controls["fullName"];
  }

  get phone() {
    return this.updateSupplierForm.controls["phone"];
  }

  get email() {
    return this.updateSupplierForm.controls["email"];
  }

  get rut() {
    return this.updateSupplierForm.controls["rut"];
  }

  get idAddress() {
    return this.updateSupplierForm.controls["idAddress"];
  }
}
