import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmTransbank, CreateVoucher, TransbankInfo, TypeRetirementEnum, TypeStatusTransbankEnum, Voucher } from '@pages/interfaces/purchase';
import { PurchaseService } from '@pages/services/purchase.service';
import { TransbankService } from '@pages/services/transbank.service';

@Component({
  selector: 'app-purchase-confirm',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './purchase-confirm.component.html',
  styleUrl: './purchase-confirm.component.scss'
})
export class PurchaseConfirmComponent {

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _transbankService = inject(TransbankService);
  private readonly _purchaseService = inject(PurchaseService);

  public transbankInfo: ConfirmTransbank = TransbankInfo;
  public voucher!: CreateVoucher;

  ngOnInit(): void {

    this._activatedRoute.queryParams.subscribe((params) => {

      this._transbankService.confirmTransationTransbank(params["token_ws"]).subscribe(result => {

        if(result.data.status === TypeStatusTransbankEnum.AUTHORIZED){

          const voucherObject: Voucher = JSON.parse(localStorage.getItem("voucher")!);

          if(voucherObject.typeRetirement === TypeRetirementEnum.HOME_DELIVERY && voucherObject.address.address.name !== ""){

            this.voucher = {
              priceTotal: voucherObject.totalPrice,
              productsQuantity: voucherObject.productsQuantity,
              discountApplied: voucherObject.discountApplied
            }

          } else if(voucherObject.typeRetirement === TypeRetirementEnum.STORE_PICKUP && voucherObject.idBranch !== 0){

            this.voucher = {
              priceTotal: voucherObject.totalPrice,
              productsQuantity: voucherObject.productsQuantity,
              discountApplied: voucherObject.discountApplied
            }
          }

          this.transbankInfo = result.data;
          this._purchaseService.createPurchase(this.voucher).subscribe(result => {

            if(result){
              localStorage.removeItem("voucher");
            }
          })

        }

      })
    });

  }

  public typeCard():string{

    let typeCard = "";

    if(this.transbankInfo.payment_type_code === 'VD'){
        typeCard = "Débito";
    }else if(this.transbankInfo.payment_type_code === 'BV' || this.transbankInfo.payment_type_code === 'VC'
            || this.transbankInfo.payment_type_code === 'YES' || this.transbankInfo.payment_type_code === 'S2'
            || this.transbankInfo.payment_type_code === 'NC' || this.transbankInfo.payment_type_code === 'VN'){
        typeCard = "Crédito";
    }else if(this.transbankInfo.payment_type_code === 'PV'){
        typeCard = "Débito Prepago";
    }

    return typeCard;
  }
}
