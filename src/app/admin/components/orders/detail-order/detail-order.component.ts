import { Order, orderJson, OrderUpdate } from '@admin/interfaces/order';
import { OrderService } from '@admin/services/order.service';
import { SaleService } from '@admin/services/sale.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderStatusEnum } from '@core/enums/orderStatus.enum';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss'
})
export class DetailOrderComponent implements OnInit {

  private readonly _orderService = inject(OrderService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _builder = inject(FormBuilder);
  private readonly _saleService = inject(SaleService);
  private readonly _alertService = inject(AlertService);
  private readonly _router = inject(Router);

  public order = signal<Order>(orderJson);
  public idShipping = this._activatedRoute.snapshot.params["id"];
  public listStatusShipping = signal<OrderStatusEnum[]>(Object.values(OrderStatusEnum));

  public updateShippingForm: FormGroup = this._builder.group({
    informationShipping: this._builder.control('', [Validators.required, Validators.maxLength(255)]),
    shippingDate: this._builder.control(''),
    deliveryDate: this._builder.control(''),
    status: this._builder.control('', Validators.required),
    trackingNumber: this._builder.control('', [Validators.required, Validators.maxLength(255)]),
    shippingCost: this._builder.control('', [Validators.required, Validators.min(0)])
  })

  ngOnInit(): void {

    this._orderService.getOrderById(this.idShipping).subscribe((response) => {
      this.order.set(response.data);

      if(response.data.shippingDate) {
        this.updateShippingForm.get('shippingDate')?.setValue(response.data.shippingDate);
      } else {
        this.updateShippingForm.get('shippingDate')?.setValue("Sin fecha de envío");
      }

      if(response.data.deliveryDate) {
        this.updateShippingForm.get('deliveryDate')?.setValue(response.data.deliveryDate);
      } else{
        this.updateShippingForm.get('deliveryDate')?.setValue("Sin fecha de entrega");
      }


      this._saleService.getSale(response.data.idOrderSale).subscribe((response) => {
        this.updateShippingForm.get('status')?.setValue(response.data.order.statusOrder);
        this.updateShippingForm.updateValueAndValidity();
      });
      this.updateShippingForm.get('informationShipping')?.setValue(response.data.informationShipping);
      this.updateShippingForm.get('trackingNumber')?.setValue(response.data.trackingNumber);
      this.updateShippingForm.get('shippingCost')?.setValue(response.data.shippingCost);
      this.updateShippingForm.get('idAddress')?.setValue(response.data.idAddress);
      this.updateShippingForm.get('shippingDate')?.disable();
      this.updateShippingForm.get('deliveryDate')?.disable();
      this.updateShippingForm.updateValueAndValidity();
    });
  }

  public updateShipping(): void {

    if(this.updateShippingForm.invalid) {
      this.updateShippingForm.markAllAsTouched();
      return;
    }

    const shippingJson: OrderUpdate = {

      informationShipping: this.updateShippingForm.value.informationShipping,
      status: this.updateShippingForm.value.status,
      trackingNumber: this.updateShippingForm.value.trackingNumber,
      shippingCost: this.updateShippingForm.value.shippingCost
    }

    this._orderService.updateOrder(this.idShipping, shippingJson).pipe(
      catchError((error) => {

        this._alertService.error("Error al actualizar", error.error.message);

        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success("Envio Actualizado", "El envio fue actualizado correctamente");
      this._router.navigate(['/admin/orders/list']);
    });
  }

  get informationShipping() {
    return this.updateShippingForm.controls["informationShipping"];
  }

  get trackingNumber() {
    return this.updateShippingForm.controls["trackingNumber"];
  }

  get shippingCost() {
    return this.updateShippingForm.controls["shippingCost"];
  }

  get idAddress() {
    return this.updateShippingForm.controls["idAddress"];
  }
}
