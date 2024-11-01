import { SupplierService } from '@admin/services/supplier.service';
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './create-supplier.component.html',
  styleUrl: './create-supplier.component.scss'
})
export class CreateSupplierComponent {

  private readonly _supplierService = inject(SupplierService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);

  public alertMessage = signal<boolean>(false);
  public calificationValue = signal<number>(0);
  public tooltipPosition = signal<number>(50);
  public tooltipVisible = signal<boolean>(false);

  public createSupplierForm: FormGroup = this._builder.group({

    name: this._builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: this._builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    rating: this._builder.control(0, [Validators.required, Validators.min(0), Validators.max(5)]),
    website: this._builder.control('')
  });

  public createSupplier(): void {

    if (this.createSupplierForm.invalid) {
      this.createSupplierForm.markAllAsTouched();
      return;
    }

    if(this.createSupplierForm.value.phone.length === 8) this.createSupplierForm.value.phone = `+569${this.createSupplierForm.value.phone}`;

    this._supplierService.createSupplier(this.createSupplierForm.value).pipe(
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

  updateTooltipPosition(event: Event): void {

    const inputElement = event.target as HTMLInputElement;
    this.calificationValue.update(() => parseFloat(inputElement.value));
  }

  showTooltip() {
    this.tooltipVisible.set(true);
  }

  hideTooltip() {
    this.tooltipVisible.set(false);
  }

  get name() {
    return this.createSupplierForm.controls["name"];
  }

  get phone() {
    return this.createSupplierForm.controls["phone"];
  }

  get email() {
    return this.createSupplierForm.controls["email"];
  }

  get rating() {
    return this.createSupplierForm.controls["rating"];
  }
}
