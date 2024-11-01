import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { PurchaseService } from '@pages/services/purchase.service';

@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.scss'
})
export class CreatePurchaseComponent {

  private readonly _purchaseService = inject(PurchaseService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);

  public createPurchaseForm: FormGroup = this._builder.group({

    quantityTotal: this._builder.control(1, [Validators.required, Validators.min(1)]),
    totalPrice: this._builder.control(1000, [Validators.required, Validators.min(1000)]),
    status: this._builder.control("", Validators.required),
    discountsAplicated: this._builder.control(0, [Validators.required, Validators.min(0)]),
    methodPayment: this._builder.control("", [Validators.required]),
    invoiveNumber: this._builder.control("", [Validators.required, Validators.minLength(1)]),
    idSupplier: this._builder.control(1, [Validators.required, Validators.min(1)]),
    idEmployee: this._builder.control(1, [Validators.required, Validators.min(1)]),
    // listProducts: ['']
  });

  public createPurchase(): void {
    if (this.createPurchaseForm.invalid) {

      this.createPurchaseForm.markAllAsTouched();
      return;
    }

  }
}
