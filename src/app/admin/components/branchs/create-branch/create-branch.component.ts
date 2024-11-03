import { AddressAdmin, CreateAddress } from '@admin/interfaces/addressAdmin';
import { AddressAdminService } from '@admin/services/address-admin.service';
import { BranchService } from '@admin/services/branch.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Commune, Province, Region } from '@pages/interfaces/locates';
import { AddressService } from '@pages/services/address.service';
import { catchError, EMPTY, of } from 'rxjs';

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
  private readonly _addressService = inject(AddressService);

  public listAddress = signal<AddressAdmin[]>([]);
  public listRegions = signal<Region[]>([]);
  public listProvinces = signal<Province[]>([]);
  public listCommunes = signal<Commune[]>([]);

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

  public createAddressForm: FormGroup = this._builder.group({

    addressName: this._builder.control("", [Validators.required, Validators.maxLength(255), Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+ \d+$/)]),
    numDepartment: this._builder.control(""),
    city: this._builder.control("", [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    description: this._builder.control(""),
    region: this._builder.control("", Validators.required),
    province: this._builder.control("", Validators.required),
    commune: this._builder.control("", Validators.required)
  })

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
