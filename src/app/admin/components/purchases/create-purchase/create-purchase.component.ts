import { Employee } from '@admin/interfaces/employee';
import { CreatePurchase } from '@admin/interfaces/purchase';
import { Supplier } from '@admin/interfaces/supplier';
import { EmployeeService } from '@admin/services/employee.service';
import { ProductService } from '@admin/services/product.service';
import { PurchaseService } from '@admin/services/purchase.service';
import { SupplierService } from '@admin/services/supplier.service';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MethodPaymentEnum } from '@core/enums/method-payment.enum';
import { StatusPurchaseEnum } from '@core/enums/statusPruchase.enum';
import { AlertService } from '@core/services/alert.service';
import { ValidatorService } from '@core/services/validator.service';
import { Product } from '@pages/interfaces/product';
import { catchError, EMPTY } from 'rxjs';

type ProductBranchForm = FormGroup<{
  idProduct: FormControl<number>;
  priceUnit: FormControl<number>;
  quantity: FormControl<number>;
}>
@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink, TitleCasePipe],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.scss'
})
export class CreatePurchaseComponent implements OnInit {

  private readonly _purchaseService = inject(PurchaseService);
  private readonly _builder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _productsService = inject(ProductService);
  private readonly _employeeService = inject(EmployeeService);
  private readonly _supplierService = inject(SupplierService);
  private readonly _validatorsService = inject(ValidatorService);
  private readonly _router = inject(Router);

  public listEmployees = signal<Employee[]>([]);
  public listSuppliers = signal<Supplier[]>([]);
  public listProducts = signal<Product[]>([]);
  public optionsStatus = signal<StatusPurchaseEnum[]>(Object.values(StatusPurchaseEnum));
  public optionsMethodPayment = signal<MethodPaymentEnum[]>(Object.values(MethodPaymentEnum));

  public createPurchaseForm: FormGroup = this._builder.group({

    quantityTotal: this._builder.control(1, [Validators.required, Validators.min(1)]),
    totalPrice: this._builder.control(1000, [Validators.required, Validators.min(1000)]),
    status: this._builder.control("", Validators.required),
    discountsAplicated: this._builder.control(0, [Validators.required, Validators.min(0)]),
    methodPayment: this._builder.control("", Validators.required),
    invoiceNumber: this._builder.control("", [Validators.required, Validators.minLength(1)]),
    idSupplier: this._builder.control("", [Validators.required, Validators.min(1)]),
    idEmployee: this._builder.control("", [Validators.required, Validators.min(1)]),
    products: this._builder.array<ProductBranchForm>([this.createProductForm()], { validators: this._validatorsService.uniqueProductValidator() })
  });

  ngOnInit(): void {

    this._productsService.getAllProducts().subscribe((response) => {
      this.listProducts.set(response.data);
    });

    this._employeeService.getAllEmployees().subscribe((response) => {
      this.listEmployees.set(response.data);
    });

    this._supplierService.getAllSuppliers().subscribe((response) => {
      this.listSuppliers.set(response.data);
    });
  }

  public createProductForm(): ProductBranchForm {
    return this._builder.group({
      idProduct: this._builder.nonNullable.control<number>(0, [Validators.required, Validators.min(1)]),
      priceUnit: this._builder.nonNullable.control<number>(1000, [Validators.required, Validators.min(1000)]),
      quantity: this._builder.nonNullable.control<number>(1, [Validators.required, Validators.min(1)])
    });
  }

  public removeProductForm(index: number): void {
    if(this.productsArray.length === 1) return;
    this.productsArray.removeAt(index);
  }

  public addProductForm(): void {
    this.productsArray.push(this.createProductForm());
  }

  public createPurchase(): void {

    if (this.createPurchaseForm.invalid) {
      this.createPurchaseForm.markAllAsTouched();
      return;
    }

    const { idEmployee, idSupplier, ...formPurchase } = this.createPurchaseForm.value;

    const createPurchase: CreatePurchase = {
      ...formPurchase,
      idEmployee: parseInt(idEmployee),
      idSupplier: parseInt(idSupplier)
    }

    this._purchaseService.createPurchase(createPurchase).pipe(
      catchError((error) => {
        this._alertService.error("Ocurrio un Error", error.error.message);
        return EMPTY;
      })
    ).subscribe(() => {
      this._alertService.success("Crear Factura", "La factura se ha creado correctamente");
      this._router.navigate(['/admin/purchases/list']);
    });
  }

  get purchaseForm(): FormGroup {
    return this.createPurchaseForm;
  }

  get productsArray(): FormArray<ProductBranchForm>{
    return this.createPurchaseForm.get('products') as FormArray<ProductBranchForm>;
  }

  get quantityTotal() {
    return this.createPurchaseForm.controls["quantityTotal"];
  }

  get totalPrice() {
    return this.createPurchaseForm.controls["totalPrice"];
  }

  get status() {
    return this.createPurchaseForm.controls["status"];
  }

  get discountsAplicated() {
    return this.createPurchaseForm.controls["discountsAplicated"];
  }

  get methodPayment() {
    return this.createPurchaseForm.controls["methodPayment"];
  }

  get invoiceNumber() {
    return this.createPurchaseForm.controls["invoiceNumber"];
  }

  get idSupplier() {
    return this.createPurchaseForm.controls["idSupplier"];
  }

  get idEmployee() {
    return this.createPurchaseForm.controls["idEmployee"];
  }
}
