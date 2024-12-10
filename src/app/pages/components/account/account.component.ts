import { DatePipe, DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { SessionService } from '@core/services/session.service';
import { ValidatorService } from '@core/services/validator.service';
import { Address, addressObject, CreateAddress } from '@pages/interfaces/address';
import { Commune, Province, Region } from '@pages/interfaces/locates';
import { Profile, profileJson } from '@pages/interfaces/profile';
import { Purchase } from '@pages/interfaces/purchase';
import { AddressService } from '@pages/services/address.service';
import { ProfileService } from '@pages/services/profile.service';
import { PurchaseService } from '@pages/services/purchase.service';
import { catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TitleCasePipe, DecimalPipe, DatePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {

  private readonly _profileService = inject(ProfileService);
  private readonly _authService = inject(AuthService);
  private readonly _sessionService = inject(SessionService);
  private readonly _router = inject(Router);
  private readonly _validatorService = inject(ValidatorService);
  private readonly _addressService = inject(AddressService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _purchaseService = inject(PurchaseService);

  public changePasswordForm: FormGroup = this._builder.group({
    currentPassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    newPassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
    reNewPassword: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)])
  }, {
    validators: this._validatorService.comparePasswords("newPassword", "reNewPassword")
  });

  public deleteAccountForm: FormGroup = this._builder.group({
    password: this._builder.control("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
  });

  public createFormAddress: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(100)]),
    addressName: this._builder.control("", [Validators.required, Validators.maxLength(60)]),
    description: this._builder.control(""),
    city: this._builder.control("", [Validators.required, Validators.maxLength(60)]),
    region: this._builder.control("", Validators.required),
    province: this._builder.control({value: "", disabled: true}, Validators.required),
    commune: this._builder.control({value: "", disabled: true}, Validators.required)
  });

  public updateFormAddress: FormGroup = this._builder.group({
    name: this._builder.control("", [Validators.required, Validators.maxLength(100)]),
    addressName: this._builder.control("", [Validators.required, Validators.maxLength(60)]),
    description: this._builder.control(""),
    city: this._builder.control("", [Validators.required, Validators.maxLength(60)]),
    region: this._builder.control("", Validators.required),
    province: this._builder.control({value: "", disabled: true}, Validators.required),
    commune: this._builder.control({value: "", disabled: true}, Validators.required)
  });

  public updateFormUser: FormGroup = this._builder.group({

    firstName: this._builder.control("", [Validators.minLength(3), Validators.maxLength(20)]),
    lastName: this._builder.control("", [Validators.minLength(3), Validators.maxLength(20)]),
    phone: this._builder.control("", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: this._builder.control("", [Validators.required, Validators.email, Validators.maxLength(255)])
  })

  public user = signal<Profile>(profileJson);
  public address = signal<Address>(addressObject);

  public listPurchase = signal<Purchase[]>([]);
  public listRegions = signal<Region[]>([]);
  public listProvince = signal<Province[]>([]);
  public listCommune = signal<Commune[]>([]);
  public listProvinceUpdate = signal<Province[]>([]);
  public listCommuneUpdate = signal<Commune[]>([]);
  public listAddress = signal<Address[]>([]);

  ngOnInit(): void {

    this._profileService.getProfileUser();

    this._profileService.profileUser$.subscribe( result => {

      this.user.set(result);

      this.updateFormUser.get("firstName")?.setValue(result.firstName);
      this.updateFormUser.get("lastName")?.setValue(result.lastName);
      this.updateFormUser.get("phone")?.setValue(result.phone.split("+569")[1]);
      this.updateFormUser.get("email")?.setValue(result.email);
      this.updateFormUser.updateValueAndValidity();
    });

    this._addressService.getAllAddress();
    this._addressService.listAddress$.subscribe(result => {
      this.listAddress.set(result);
    });

    this._addressService.getAllRegions().subscribe(result => {
      this.listRegions.set(result.data);
    });

    this._purchaseService.getAllPurchasesUser().subscribe(result => {

      if(result){
        this.listPurchase.set(result.data);
      }
    })
  }

  public logout():void {

    this._authService.logout();
    sessionStorage.clear();
    this._sessionService.changeFalseSession();
    this._router.navigate(['/']);
  }

  public deleteAccount():void {

    Swal.fire({
      title: "¿Estas seguro de eliminar tu cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this._profileService.deleteAccount(this.deleteAccountForm.value).subscribe(() => {
          this._alertService.success("Cuenta Eliminada", "La cuenta a sido eliminada con exito");
          sessionStorage.clear();
          this._sessionService.changeFalseSession();
          this._router.navigate(['/']);
        })
      }
    });
  }

  public deleteAddress(idAddress: number):void {

    Swal.fire({
      title: "¿Estas seguro de eliminar esta dirección?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this._addressService.deleteAddress(idAddress).subscribe(() => {
          this._alertService.toastSuccess("La dirección a sido eliminada con exito");
          this._addressService.getAllAddress();
        })
      }
    });

  }

  public getAddress(idAddress: number):void{

    this._addressService.getAddress(idAddress).subscribe(result => {

      this.address.set(result.data);

      this.listCommuneUpdate.set([]);
      this.listProvinceUpdate.set([]);

      this._addressService.getCommune(result.data.address.commune.idCommune).subscribe(result => {

        this.updateFormAddress.get("commune")?.enable();
        this.updateFormAddress.get("commune")?.setValue(result.data.idCommune);

        this._addressService.getProvince(result.data.idProvince).subscribe(result => {

          this.updateFormAddress.get("province")?.enable();
          this.updateFormAddress.get("province")?.setValue(result.data.idProvince);

          this._addressService.getProvinceCommune(result.data.idProvince).subscribe(result => {
            this.listCommuneUpdate.set(result.data);
          });

          this._addressService.getRegion(result.data.idRegion).subscribe(result => {

            this._addressService.getProvinceRegion(result.data.idRegion).subscribe(result => {

              this.listProvinceUpdate.set(result.data);
            });

            this.updateFormAddress.get("region")?.setValue(result.data.idRegion);
          });
        });
      });

      this.updateFormAddress.get("name")?.setValue(result.data.name);
      this.updateFormAddress.get("addressName")?.setValue(result.data.address.addressName);
      this.updateFormAddress.get("numDepartment")?.setValue(result.data.address.numDepartment);
      this.updateFormAddress.get("description")?.setValue(result.data.address.description);
      this.updateFormAddress.get("city")?.setValue(result.data.address.city);
      this.updateFormAddress.updateValueAndValidity();

    });
  }

  public updateAddress():void{

    const form = this.updateFormAddress.value;

    if(this.updateFormAddress.invalid){

      this.updateFormAddress.markAllAsTouched();
      return;
    }

    const addressJson: CreateAddress = {
      name: form.name,
      addressName: form.addressName,
      numDepartment: form.numDepartment,
      city: form.city,
      description: form.description,
      idCommune: parseInt(form.commune),
    }

    this._addressService.updateAddress(this.address().idAddress, addressJson).subscribe(result => {
      this._alertService.toastSuccess("La dirección se actualizo con exito");
      this._addressService.getAllAddress();
    });
  }

  public createAddress():void {

    const form = this.createFormAddress.value;

    if(this.createFormAddress.invalid){

      this.createFormAddress.markAllAsTouched();
      return;
    }
    const jsonAddress: CreateAddress = {
      name: form.name,
      addressName: form.addressName,
      numDepartment: form.numDepartment,
      city: form.city,
      description: form.description,
      idCommune: parseInt(form.commune),
    }

    this._addressService.createAddress(jsonAddress).subscribe(result => {
      this._alertService.toastSuccess("La dirección se registro con exito");
      this._addressService.getAllAddress();
      this.createFormAddress.reset();
      this.createFormAddress.patchValue({phone: "+569"});

      this.listProvince.set([]);
      this.listCommune.set([]);
      this.createFormAddress.get("province")?.disable();
      this.createFormAddress.get("commune")?.disable();
    });

  }

  public updateProfile():void {

    if(this.updateFormUser.invalid){

      this.updateFormUser.markAllAsTouched();
      return;
    }

    if(this.updateFormUser.value.phone.length === 8) this.updateFormUser.value.phone = `+569${this.updateFormUser.value.phone}`;

    this._profileService.updateProfileUser(this.updateFormUser.value).subscribe(() => {
      this._profileService.getProfileUser();
      this._alertService.success("Datos Cambiados", "Los datos han sidos actualizados correctamente");
    })
  }

  public updateChangeRegion(event: Event):void{

    this.listProvinceUpdate.set([]);
    this.listCommuneUpdate.set([]);

    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceRegion(parseInt(element.value)).subscribe(result => {

        this.listProvinceUpdate.set(result.data);
        this.updateFormAddress.get("province")?.enable();
      });

    }

    this.updateFormAddress.get("province")?.disable();
    this.updateFormAddress.get("commune")?.disable();
  }

  public updateChangeProvince(event: Event):void{

    this.listCommuneUpdate.set([]);
    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceCommune(parseInt(element.value)).subscribe(result => {

        this.listCommuneUpdate.set(result.data);
        this.updateFormAddress.get("commune")?.enable();
      });
    } else {
      this.updateFormAddress.get("commune")?.disable();
    }
  }

  public changeRegion(event: Event):void{

    this.listProvince.set([]);
    this.listCommune.set([]);

    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceRegion(parseInt(element.value)).subscribe(result => {

        this.listProvince.set(result.data);
        this.createFormAddress.get("province")?.enable();
      });

    }

    this.createFormAddress.get("province")?.disable();
    this.createFormAddress.get("commune")?.disable();
  }

  public changeProvince(event: Event):void{

    this.listCommune.set([]);
    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceCommune(parseInt(element.value)).subscribe(result => {

        this.listCommune.set(result.data);
        this.createFormAddress.get("commune")?.enable();
      });
    } else {
      this.createFormAddress.get("commune")?.disable();
    }
  }

  public changePassword():void{

    if(this.changePasswordForm.invalid){
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: "Cambiar Contraseña",
      text: "Al cambiar tu contraseña se cerrara tu sesión actual, ¿quieres continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Confirmar",
      cancelButtonText: "No, Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {

        this._profileService.changePassword(this.changePasswordForm.value).pipe(
          catchError(() => {
            this._alertService.error("Cambio Contraseña", "Ocurrio un error al momento de cambiar la contraseña");
            return EMPTY;
          })
        ).subscribe(() => {

          this._authService.logout().subscribe(() => {
            this._alertService.success("Cambio Contraseña", "Se cambio la contraseña correctamente");
            this._router.navigate(['/']);
          });
        });

      }
    });

  }

  get passwordDeleteAccount(){
    return this.deleteAccountForm.controls["password"];
  }

  get name(){
    return this.createFormAddress.controls["name"];
  }

  get addressName(){
    return this.createFormAddress.controls["addressName"];
  }

  get city(){
    return this.createFormAddress.controls["city"];
  }

  get formRegion(){
    return this.createFormAddress.controls["region"];
  }

  get formProvince(){
    return this.createFormAddress.controls["province"];
  }

  get formCommune(){
    return this.createFormAddress.controls["commune"];
  }



  get updateName(){
    return this.updateFormAddress.controls["name"];
  }

  get updateAddressName(){
    return this.updateFormAddress.controls["addressName"];
  }

  get updateCity(){
    return this.updateFormAddress.controls["city"];
  }

  get updateFormRegion(){
    return this.updateFormAddress.controls["region"];
  }

  get updateFormProvince(){
    return this.updateFormAddress.controls["province"];
  }

  get updateFormCommune(){
    return this.updateFormAddress.controls["commune"];
  }


  get currentPassword(){
    return this.changePasswordForm.controls["currentPassword"];
  }

  get newPassword(){
    return this.changePasswordForm.controls["newPassword"];
  }

  get reNewPassword(){
    return this.changePasswordForm.controls["reNewPassword"];
  }

  get firstName(){
    return this.updateFormUser.controls["firstName"];
  }

  get lastName(){
    return this.updateFormUser.controls["lastName"];
  }

  get phone(){
    return this.updateFormUser.controls["phone"];
  }

  get email(){
    return this.updateFormUser.controls["email"];
  }
}
