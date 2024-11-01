import { SupplierService } from '@admin/services/supplier.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './update-supplier.component.html',
  styleUrl: './update-supplier.component.scss'
})
export class UpdateSupplierComponent implements OnInit {

  private readonly _supplierService = inject(SupplierService);
  private readonly _router = inject(Router);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public alertMessage = signal<boolean>(false);
  public calificationValue = signal<number>(0);
  public tooltipPosition = signal<number>(50);
  public tooltipVisible = signal<boolean>(false);
  private idSupplier = this._activatedRoute.snapshot.params["id"];

  public updateSupplierForm: FormGroup = this._builder.group({

    name: this._builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    phone: this._builder.control('', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]),
    email: this._builder.control('', [Validators.required, Validators.email, Validators.maxLength(255)]),
    rating: this._builder.control(0, [Validators.required, Validators.min(0), Validators.max(5)]),
    website: this._builder.control('')
  });

  ngOnInit(): void {

      this._supplierService.getSupplier(this.idSupplier).subscribe((supplier) => {


        this.updateSupplierForm.get('name')?.setValue(supplier.data.name);
        this.updateSupplierForm.get('phone')?.setValue(supplier.data.phone.split("+569")[1]);
        this.updateSupplierForm.get('email')?.setValue(supplier.data.email);
        this.updateSupplierForm.get('rating')?.setValue(supplier.data.rating);
        this.updateSupplierForm.get('website')?.setValue(supplier.data.website);
        this.updateSupplierForm.updateValueAndValidity();
      });
  }

  public updateSupplier(): void {

    if (this.updateSupplierForm.invalid) {
      this.updateSupplierForm.markAllAsTouched();
      return;
    }

    if(this.updateSupplierForm.value.phone.length === 8) this.updateSupplierForm.value.phone = `+569${this.updateSupplierForm.value.phone}`;

    this._supplierService.updateSupplier(this.idSupplier, this.updateSupplierForm.value).pipe(
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
    return this.updateSupplierForm.controls["name"];
  }

  get phone() {
    return this.updateSupplierForm.controls["phone"];
  }

  get email() {
    return this.updateSupplierForm.controls["email"];
  }

  get rating() {
    return this.updateSupplierForm.controls["rating"];
  }
}
