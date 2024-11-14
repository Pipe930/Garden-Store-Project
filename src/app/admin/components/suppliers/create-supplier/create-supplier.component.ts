import { AddressAdmin, CreateAddress } from '@admin/interfaces/addressAdmin';
import { CreateSupplier } from '@admin/interfaces/supplier';
import { AddressAdminService } from '@admin/services/address-admin.service';
import { SupplierService } from '@admin/services/supplier.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Commune, Province, Region } from '@pages/interfaces/locates';
import { AddressService } from '@pages/services/address.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create-supplier.component.html',
  styleUrl: './create-supplier.component.scss'
})
export class CreateSupplierComponent implements OnInit {

  private readonly _supplierService = inject(SupplierService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _addressAdminService = inject(AddressAdminService);
  private readonly _addressService = inject(AddressService);

  public alertMessage = signal<boolean>(false);
  public calificationValue = signal<number>(0);
  public tooltipPosition = signal<number>(50);
  public tooltipVisible = signal<boolean>(false);

  public listRegions = signal<Region[]>([]);
  public listProvinces = signal<Province[]>([]);
  public listCommunes = signal<Commune[]>([]);
  public listAddress = signal<AddressAdmin[]>([]);

  public createSupplierForm: FormGroup = this._builder.group({

    fullName: this._builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    rut: this._builder.control('', [Validators.required, Validators.pattern(/^\d{8}-[\dkK]$/)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: this._builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    idAddress: this._builder.control('', Validators.required)
  });

  public createAddressForm: FormGroup = this._builder.group({

    addressName: this._builder.control("", [Validators.required, Validators.maxLength(255), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+ \d+$/)]),
    numDepartment: this._builder.control(""),
    city: this._builder.control("", [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    description: this._builder.control(""),
    region: this._builder.control("", Validators.required),
    province: this._builder.control("", Validators.required),
    commune: this._builder.control("", Validators.required)
  });

  ngOnInit(): void {
      this._addressAdminService.getAllAddress();
      this._addressAdminService.listAddressAdmin$.subscribe(address => {
        this.listAddress.set(address);
      });

      this._addressService.getAllRegions().subscribe(response => {
        this.listRegions.set(response.data);

        this.createAddressForm.get("province")?.disable();
        this.createAddressForm.get("commune")?.disable();

      });
  }

  public createSupplier(): void {

    if (this.createSupplierForm.invalid) {
      this.createSupplierForm.markAllAsTouched();
      return;
    }

    if(this.createSupplierForm.value.phone.length === 8) this.createSupplierForm.value.phone = `+569${this.createSupplierForm.value.phone}`;

    const { idAddress, ...formSupplier } = this.createSupplierForm.value;

    const createSupplier: CreateSupplier = {
      ...formSupplier,
      idAddress: parseInt(idAddress)
    }

    this._supplierService.createSupplier(createSupplier).pipe(
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

  public createAddress(): void {

    if(this.createAddressForm.invalid) {
      this.createAddressForm.markAllAsTouched();
      return;
    }

    const form = this.createAddressForm.value;

    const json: CreateAddress = {
      addressName: form.addressName,
      numDepartment: form.numDepartment,
      city: form.city,
      description: form.description,
      idCommune: parseInt(form.commune)
    }

    this._addressAdminService.createAddress(json).pipe(
      catchError((error) => {
        if(error.error.statusCode === HttpStatusCode.BadRequest) this._alertService.error("Error", "No se pudo crear la dirección");

        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success("Dirección Creada", "La dirección ha sido creada correctamente");
      this._addressAdminService.getAllAddress();
      this.createAddressForm.reset();
      this.createAddressForm.get("province")?.disable();
      this.createAddressForm.get("commune")?.disable();
    });
  }

  public changeRegion(event: Event):void{

    this.listProvinces.set([]);
    this.listCommunes.set([]);

    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceRegion(parseInt(element.value)).subscribe(response => {

        this.listProvinces.set(response.data);
        this.createAddressForm.get("province")?.enable();
      });
    }

    this.createAddressForm.get("province")?.disable();
    this.createAddressForm.get("commune")?.disable();
  }

  public changeProvince(event: Event):void{

    this.listCommunes.set([]);
    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceCommune(parseInt(element.value)).subscribe(response => {

        this.listCommunes.set(response.data);
        this.createAddressForm.get("commune")?.enable();
      });
    } else {
      this.createAddressForm.get("commune")?.disable();
    }
  }

  get addressName() {
    return this.createAddressForm.controls["addressName"];
  }

  get numDepartment() {
    return this.createAddressForm.controls["numDepartment"];
  }

  get city() {
    return this.createAddressForm.controls["city"];
  }

  get description() {
    return this.createAddressForm.controls["description"];
  }

  get region() {
    return this.createAddressForm.controls["region"];
  }

  get province() {
    return this.createAddressForm.controls["province"];
  }

  get commune() {
    return this.createAddressForm.controls["commune"];
  }

  get fullName() {
    return this.createSupplierForm.controls["fullName"];
  }

  get phone() {
    return this.createSupplierForm.controls["phone"];
  }

  get email() {
    return this.createSupplierForm.controls["email"];
  }

  get rut() {
    return this.createSupplierForm.controls["rut"];
  }

  get idAddress() {
    return this.createSupplierForm.controls["idAddress"];
  }
}
