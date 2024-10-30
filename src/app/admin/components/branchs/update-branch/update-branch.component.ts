import { AddressAdmin } from '@admin/interfaces/addressAdmin';
import { Branch, branchJson, CreateProductBranchForm, ProductBranchType } from '@admin/interfaces/branch';
import { AddressAdminService } from '@admin/services/address-admin.service';
import { BranchService } from '@admin/services/branch.service';
import { ProductService } from '@admin/services/product.service';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Product } from '@pages/interfaces/product';

type ProductBranchForm = FormGroup<{
  idProduct: FormControl<number>;
  quantity: FormControl<number>;
}>

@Component({
  selector: 'app-update-branch',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, ReactiveFormsModule, NgClass],
  templateUrl: './update-branch.component.html',
  styleUrl: './update-branch.component.scss'
})
export class UpdateBranchComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _branchService = inject(BranchService);
  private readonly _alertService = inject(AlertService);
  private readonly _addressAdminService = inject(AddressAdminService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _builder = inject(FormBuilder);
  private readonly _productService = inject(ProductService);

  public branch = signal<Branch>(branchJson);

  private idBranch = this._activatedRoute.snapshot.params["id"];
  public dateTomorrow = signal<string>("");
  public isDisabled = signal<boolean>(false);
  public address = signal<AddressAdmin>({
    addressName: "",
    numDepartment: "",
    city: "",
    description: "",
    idCommune: 0,
    idAddress: 0
  });
  public listProducts = signal<Product[]>([]);

  public createProductBranchForm: FormGroup = this._builder.group({
    products: this._builder.array<ProductBranchForm>([this.createProductForm()])
  });

  ngOnInit(): void {

    const today = new Date().getDate();
    const tomorrow = new Date();
    tomorrow.setDate(today + 1);
    let tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    this.dateTomorrow.set(tomorrowFormatted);

    this._branchService.getBranch(this.idBranch).subscribe(response => {
      this.branch.set(response.data);

      this._addressAdminService.getAddress(response.data.idAddress).subscribe(response => {
        this.address.set(response.data);
      })
    });

    this._productService.getAllProducts().subscribe(response => {
      this.listProducts.set(response.data);
    });
  }

  public createProductBranch(): void {
    console.log(this.createProductBranchForm.value);

    if(this.createProductBranchForm.invalid){
      this.createProductBranchForm.markAllAsTouched();
      return;
    }

    const productBranchJson: CreateProductBranchForm = {
      idBranch: parseInt(this.idBranch),
      products: this.createProductBranchForm.value.products
    }

    this._branchService.createStockBranch(productBranchJson).subscribe(() => {
      this._alertService.success("Productos Añadidos", "Los productos han sido añadidos correctamente");
    });
  }

  public createProductForm(): ProductBranchForm{
    return this._builder.group({
      idProduct: this._builder.nonNullable.control<number>(0, [Validators.required, Validators.min(1)]),
      quantity: this._builder.nonNullable.control<number>(1, [Validators.required, Validators.min(1)])
    });
  }

  get productsArray(): FormArray<ProductBranchForm>{
    return this.createProductBranchForm.get('products') as FormArray<ProductBranchForm>;
  }

  public removeProductForm(index: number): void {
    if(this.productsArray.length === 1) return;
    this.productsArray.removeAt(index);
  }

  // selectProduct(index: number): void {
  //   const selectedProducts = this.getSelectedProducts();
  //   this.updateProductOptions(selectedProducts);
  // }

  // private getSelectedProducts(): number[] {
  //   return this.productsArray.controls
  //   .map((control) => control.get('idProduct')?.value)
  //   .filter((value) => value !== null) as number[];
  // }

  // private updateProductOptions(selectedProducts: number[]): void {
  //   this.productsArray.controls.forEach((control, index) => {
  //     const productControl = control.get('idProduct') as FormControl;
  //     const availableOptions = this.listProducts().filter(
  //       (product) => !selectedProducts.includes(product.idProduct) || product.idProduct === productControl.value
  //     );
  //     // Aquí podrías pasar `availableOptions` al HTML para mostrar solo las opciones disponibles.
  //     control.patchValue({ idProduct: availableOptions[0].idProduct });
  //   });
  // }

  public addProductForm(): void {
    this.productsArray.push(this.createProductForm());
  }
}
