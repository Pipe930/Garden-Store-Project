import { StatusPurchaseEnum } from '@admin/interfaces/purchase';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmTransbank, TransbankInfo, TypeRetirementEnum, TypeStatusTransbankEnum, UpdateVoucher, VoucherConfirm } from '@pages/interfaces/purchase';
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
  public voucherConfirmObject!: VoucherConfirm;
  public updateSale!: UpdateVoucher;

  ngOnInit(): void {

    this._activatedRoute.queryParams.subscribe((params) => {

      this._transbankService.confirmTransationTransbank(params["token_ws"]).subscribe(result => {

        if(result.data.status === TypeStatusTransbankEnum.AUTHORIZED){

          this.voucherConfirmObject = JSON.parse(localStorage.getItem("voucher")!);

          this.transbankInfo = result.data;

          if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.HOME_DELIVERY){

            this.updateSale = {

              status: StatusPurchaseEnum.PAID,
              shipping: {
                informationShipping: "Envio para cliente a domicilio",
                shippingCost: 0,
                idAddress: this.voucherConfirmObject.address.idAddress
              }
            }
          } else if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.STORE_PICKUP){

            this.updateSale = {
              status: StatusPurchaseEnum.PAID
            }
          }

          this._purchaseService.updateStatusPurchase(this.voucherConfirmObject.idSale, this.updateSale).subscribe(() => {
              localStorage.removeItem("voucher");
          });


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
