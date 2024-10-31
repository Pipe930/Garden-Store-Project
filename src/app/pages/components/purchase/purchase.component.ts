import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@core/services/alert.service';
import { CartService } from '@pages/services/cart.service';
import { Cart, cartJson } from '@pages/interfaces/cart';
import { AddressService } from '@pages/services/address.service';
import { Address, addressObject } from '@pages/interfaces/address';
import { Commune, Province, Region } from '@pages/interfaces/locates';
import { TransationTransbank, TypePaimentEnum, TypeRetirementEnum, Voucher, VoucherObject } from '@pages/interfaces/purchase';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, TitleCasePipe } from '@angular/common';
import { SessionService } from '@core/services/session.service';
import { TransbankService } from '@pages/services/transbank.service';
import { Branch } from '@admin/interfaces/branch';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [RouterLink, NgClass, CurrencyPipe, TitleCasePipe, ReactiveFormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss'
})
export class PurchaseComponent implements OnInit {

  private readonly _addressService = inject(AddressService);
  private readonly _cartService = inject(CartService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _sessionService = inject(SessionService);
  private readonly _transbankService = inject(TransbankService);

  public formCreateAddress: FormGroup = this._builder.group({

    name: this._builder.nonNullable.control("", [Validators.required, Validators.maxLength(100)]),
    addressName: this._builder.nonNullable.control("", [Validators.required, Validators.maxLength(100)]),
    numDepartment: this._builder.nonNullable.control("", Validators.maxLength(40)),
    city: this._builder.nonNullable.control("", [Validators.required, Validators.maxLength(100)]),
    description: this._builder.nonNullable.control(""),
    region: this._builder.nonNullable.control("", Validators.required),
    province: this._builder.nonNullable.control({value: "", disabled: true}, Validators.required),
    commune: this._builder.nonNullable.control({value: "", disabled: true}, Validators.required)
  });

  public displayDispatchShop: boolean = false;
  public displayDispatchSend: boolean = false;
  public isFormCreateAddress: boolean = false;
  public isSelectAddress: boolean = true;
  public isSelectPay: boolean = false;
  public activeSelectedAddress: boolean = false;
  public activeErrorNumber: boolean = false;

  public creditCard: string = TypePaimentEnum.CREDIT_CARD;
  public debitCard: string = TypePaimentEnum.DEBIT_CARD;
  public marketPayment: string = TypePaimentEnum.MARKET_PAYMENT;
  public retirementStorePickup: string = TypeRetirementEnum.STORE_PICKUP;
  public retirementHomeDelivery: string = TypeRetirementEnum.HOME_DELIVERY;

  public listAddress = signal<Address[]>([]);
  public listBranchs = signal<Branch[]>([]);
  public listRegions = signal<Region[]>([]);
  public listProvince = signal<Province[]>([]);
  public listCommune = signal<Commune[]>([]);
  public cart = signal<Cart>(cartJson);

  public voucher: Voucher = VoucherObject;

  ngOnInit(): void {

    this._cartService.getCartUser();
    this._cartService.cartCurrent$.subscribe(result => {
      this.cart.set(result);
    });

    this._addressService.getAllAddress();
    this._addressService.listAddress$.subscribe(result => {
      this.listAddress.set(result);
    });

    this._addressService.getAllRegions().subscribe(result => {
      this.listRegions.set(result.data);
    });

    // this._addressService.getAllBranchs().subscribe(result => {
    //   this.listBranchs = result.data;
    // })

  }

  public changeRegion(event: Event):void{

    this.listProvince.set([]);
    this.listCommune.set([]);

    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceRegion(parseInt(element.value)).subscribe(result => {

        this.listProvince.set(result.data);
        this.formCreateAddress.get("province")?.enable();
      });

    }

    this.formCreateAddress.get("province")?.disable();
    this.formCreateAddress.get("commune")?.disable();
  }

  public changeProvince(event: Event):void{

    this.listCommune.set([]);
    const element = event.target as HTMLSelectElement;

    if(element.value != ""){
      this._addressService.getProvinceCommune(parseInt(element.value)).subscribe(result => {

        this.listCommune.set(result.data);
        this.formCreateAddress.get("commune")?.enable();
      });
    } else {
      this.formCreateAddress.get("commune")?.disable();
    }
  }

  public createAddress():void {

    const form = this.formCreateAddress.value;

    if(this.formCreateAddress.invalid){

      this.formCreateAddress.markAllAsTouched();
      return;
    }

    let list_elements = form.addressName.split(" ");
    let number = list_elements[list_elements.length - 1];

    if(!isNaN(number) && !isNaN(parseFloat(number))){

      const json = {
        name: form.name,
        addressName: form.addressName,
        numDepartment: form.numDepartment,
        city: form.city,
        description: form.description,
        idCommune: parseInt(form.commune)
      }

      this._addressService.createAddress(json).subscribe(result => {
        this._alertService.toastSuccess("La dirección se registro con exito");
        this._addressService.getAllAddress();
        this.formCreateAddress.reset();
        this.formCreateAddress.patchValue({phone: "+569"});

        this.listProvince.set([]);
        this.listCommune.set([]);
        this.activeErrorNumber = false;
        this.formCreateAddress.get("province")?.disable();
        this.formCreateAddress.get("commune")?.disable();
      });
    } else {

      this.activeErrorNumber = true;
    }
  }

  get name(){
    return this.formCreateAddress.controls["name"];
  }

  get addressName(){
    return this.formCreateAddress.controls["addressName"];
  }

  get numDepartment(){
    return this.formCreateAddress.controls["numDepartment"];
  }

  get city(){
    return this.formCreateAddress.controls["city"];
  }

  get description(){
    return this.formCreateAddress.controls["description"];
  }


  get formProvince(){
    return this.formCreateAddress.controls["province"];
  }

  get formCommune(){
    return this.formCreateAddress.controls["commune"];
  }

  public toggleDispatchShop():void {

    this.voucher.typeRetirement = TypeRetirementEnum.STORE_PICKUP;
    this.resetDataAddress();
  }

  public toggleDispatchSend():void {

    this.voucher.typeRetirement= TypeRetirementEnum.HOME_DELIVERY;
    this.resetDataAddress();
  }

  private resetDataAddress(): void{

    if(this.voucher.typeRetirement === TypeRetirementEnum.STORE_PICKUP){
      this.displayDispatchSend = false;
      this.displayDispatchShop = true;
    } else {
      this.displayDispatchSend = true;
      this.displayDispatchShop = false;
    }

    this.voucher.address = addressObject;
    this.voucher.idBranch = 0;
  }

  public toggleFormAddress():void {

    this.isFormCreateAddress = true;
  }

  public selectRetirePerson(event: Event):void {

    const element = event.target as HTMLInputElement;

    this.voucher.typePerson = element.value;

  }

  public selectBranch(event: Event):void {

    const element = event.target as HTMLSelectElement;

    this.voucher.idBranch = parseInt(element.value);
  }

  public selectPayment(event: Event):void {

    const element = event.target as HTMLInputElement;

    this.voucher.typePay = element.value;
  }

  public selectedAddress(address: Address):void{

    this.voucher.address= address;
  }

  public continuePay():void{

    if((this.voucher.address.address.addressName !== "" || this.voucher.idBranch !== 0) && this.voucher.typePerson !== ""){

      this.isSelectAddress = false;
      this.isSelectPay = true;
    } else {

      this._alertService.error("Error", "Tiene que seleccionar el metodo de retiro del producto");
    }

  }

  public createPay():void {

    if((this.voucher.address.address.addressName !== "" || this.voucher.idBranch !== 0) &&
      this.voucher.typePerson !== "" &&
      this.voucher.typePay !== ""){

        let tokenUser = this._sessionService.getSession()?.access;
        let arrayTokenUser = tokenUser?.split(".");
        let uuidRandom = crypto.randomUUID();
        let uuid = uuidRandom.split("-").join("");

        const transation: TransationTransbank = {
          buyOrder: uuid.substring(1, 25),
          sessionId: arrayTokenUser![2],
          amount: this.cart().priceTotal,
          returnUrl: "http://127.0.0.1:4200/purchase-confirm"
        }

        this._transbankService.createTransationTransbank(transation).subscribe(result => {

          this.voucher.totalPrice = this.cart().priceTotal;
          this.voucher.productsQuantity = this.cart().productsTotal;
          this.voucher.discountApplied = this.cart().priceTotalDiscount;
          localStorage.setItem("voucher", JSON.stringify(this.voucher));
          let form = document.createElement("form");
          form.method = "POST";
          form.action = result.data.url;
          form.hidden = true;

          let element = document.createElement("input");
          element.hidden = true;
          element.value = result.data.token;
          element.name = 'token_ws';
          form.appendChild(element);
          document.body.appendChild(form);
          form.submit();
        });

      } else {

        this._alertService.error("Error", "Tiene que seleccionar un metodo de pago");
      }
  }

  public returnStepPrevius():void {

    this.isSelectAddress = true;
    this.isSelectPay = false;
  }
}
