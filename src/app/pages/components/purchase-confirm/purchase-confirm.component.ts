import { StatusPurchaseEnum } from '@core/enums/statusPruchase.enum';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TypeRetirementEnum, UpdateVoucher, VoucherConfirm } from '@pages/interfaces/purchase';
import { PurchaseService } from '@pages/services/purchase.service';
import { TransbankService } from '@pages/services/transbank.service';
import { MethodPaymentEnum } from '@core/enums/method-payment.enum';
import { ConfirmTransbank, TransbankInfo, TypeStatusTransbankEnum } from '@pages/interfaces/transbank';
import { PaypalService } from '@pages/services/paypal.service';
import { CommitPaypal } from '@pages/interfaces/paypal';

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
  private readonly _paypalService = inject(PaypalService);

  public transbankInfo: ConfirmTransbank = TransbankInfo;
  public voucherConfirmObject!: VoucherConfirm;
  public updateSale!: UpdateVoucher;

  ngOnInit(): void {

    const queryParams = this._activatedRoute.snapshot.queryParamMap;

    console.log(queryParams.has("token"));

    if(queryParams.has("token_ws")){
      this._transbankService.confirmTransationTransbank(queryParams.get("token_ws")!).subscribe(result => {

        if(result.data.status === TypeStatusTransbankEnum.AUTHORIZED){

          this.voucherConfirmObject = JSON.parse(localStorage.getItem("voucher")!);

          this.transbankInfo = result.data;

          if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.HOME_DELIVERY){

            this.updateSale = {

              status: StatusPurchaseEnum.PAID,
              methodPayment: this.typeCard(),
              shipping: {
                informationShipping: "Envio para cliente a domicilio",
                shippingCost: 0,
                idAddress: this.voucherConfirmObject.address.idAddress
              }
            }
          } else if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.STORE_PICKUP){

            this.updateSale = {
              status: StatusPurchaseEnum.PAID,
              methodPayment: this.typeCard(),
            }
          }

          this._purchaseService.updateStatusPurchase(this.voucherConfirmObject.idSale, this.updateSale).subscribe(() => {
              localStorage.removeItem("voucher");
          });
        }
      })
    }

    if(queryParams.has("token") || queryParams.has("PayerID")){

      const paypalCommit: CommitPaypal = {
        token: queryParams.get("token")!,
        PayerID: queryParams.get("PayerID")!
      }

      this._paypalService.commitPaypal(paypalCommit).subscribe(() => {

        this.voucherConfirmObject = JSON.parse(localStorage.getItem("voucher")!);

        if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.HOME_DELIVERY){

          this.updateSale = {

            status: StatusPurchaseEnum.PAID,
            methodPayment: MethodPaymentEnum.PAYPAL,
            shipping: {
              informationShipping: "Envio para cliente a domicilio",
              shippingCost: 0,
              idAddress: this.voucherConfirmObject.address.idAddress
            }
          }
        } else if(this.voucherConfirmObject.typeRetirement === TypeRetirementEnum.STORE_PICKUP){

          this.updateSale = {
            status: StatusPurchaseEnum.PAID,
            methodPayment: MethodPaymentEnum.PAYPAL,
          }
        }

        this._purchaseService.updateStatusPurchase(this.voucherConfirmObject.idSale, this.updateSale).subscribe(() => {
            localStorage.removeItem("voucher");
        });
      });
    }


  }

  public typeCard():string {

    let typeCard = "";

    if(this.transbankInfo.payment_type_code === 'VD'){
        typeCard = MethodPaymentEnum.DEBIT_CARD;
    }else if(this.transbankInfo.payment_type_code === 'BV' || this.transbankInfo.payment_type_code === 'VC'
            || this.transbankInfo.payment_type_code === 'YES' || this.transbankInfo.payment_type_code === 'S2'
            || this.transbankInfo.payment_type_code === 'NC' || this.transbankInfo.payment_type_code === 'VN'){
        typeCard = MethodPaymentEnum.CREDIT_CARD;
    }else if(this.transbankInfo.payment_type_code === 'PV'){
        typeCard = MethodPaymentEnum.TRANSFER;
    }

    return typeCard;
  }
}

