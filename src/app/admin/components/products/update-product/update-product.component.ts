import { CategoryService } from '@admin/services/category.service';
import { ProductService } from '@admin/services/product.service';
import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Category } from '@pages/interfaces/category';
import { Product, productJson } from '@pages/interfaces/product';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {

  private readonly _productService = inject(ProductService);
  private readonly _router = inject(Router);
  private readonly _activedRoute = inject(ActivatedRoute);
  private readonly _alertService = inject(AlertService);
  private readonly _builder = inject(FormBuilder);
  private readonly _categoryService = inject(CategoryService);

  public imageProduct = viewChild.required<ElementRef>('imageProduct');
  public imagePreview = viewChild.required<ElementRef>('imagePreview');

  public listCategories = signal<Category[]>([]);
  public product = signal<Product>(productJson);
  private idProduct = 0;

  public updateProductForm: FormGroup = this._builder.group({

    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    price: this._builder.control(0, [Validators.required, Validators.min(1000)]),
    brand: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    returnPolicy: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    published: this._builder.control(false),
    category: this._builder.control('', Validators.required),
    offer: this._builder.control(''),
    description: this._builder.control('', Validators.maxLength(255)),
  });

  ngOnInit(): void {

    this._categoryService.getAllCategories().subscribe((response) => {
      this.listCategories.set(response.data);
    });

    this._activedRoute.params.subscribe((params) => {

      this.idProduct = params["id"]
      this._productService.getProduct(this.idProduct).subscribe((product) => {

        const categoryObtain = this.listCategories().filter((category) => category.name == product.data.category.name);

        this.product.set(product.data);
        this.updateProductForm.get("title")?.setValue(product.data.title);
        this.updateProductForm.get("brand")?.setValue(product.data.brand);
        this.updateProductForm.get("price")?.setValue(product.data.price);
        this.updateProductForm.get("published")?.setValue(product.data.published);
        this.updateProductForm.get("returnPolicy")?.setValue(product.data.returnPolicy);
        this.updateProductForm.get("description")?.setValue(product.data.description);
        this.updateProductForm.get("category")?.setValue(categoryObtain[0].idCategory.toString());
        // if(product.data.offer){
        //   const offerObtain = this.listOffer.filter((offer) => offer.name_offer === product.data.offer?.name_offer);
        //   this.updateProductForm.get("offer")?.setValue(offerObtain[0].id_offer);
        // }
        this.updateProductForm.updateValueAndValidity();
      });
    });
  }

  public updateProduct(): void {

    if (this.updateProductForm.invalid) {
      this.updateProductForm.markAllAsTouched();
      return;
    }

    const { thumbnail, category, offer, ...forms } = this.updateProductForm.value;

    this._productService.updateProduct(      {
      ...forms,
      idCategory: parseInt(category),
      idOffer: offer ? parseInt(offer) : null
    }, this.idProduct).subscribe((response) => {

      this._alertService.success("Producto actualizado", "El producto se ha actualizado correctamente");
      this._router.navigate(["/admin/products/list"]);
    });
  }


  get title() {
    return this.updateProductForm.controls["title"];
  }

  get price() {
    return this.updateProductForm.controls['price'];
  }

  get brand() {
    return this.updateProductForm.controls['brand'];
  }

  get returnPolicy() {
    return this.updateProductForm.controls['returnPolicy'];
  }

  get description() {
    return this.updateProductForm.controls['description'];
  }

  get idCategory() {
    return this.updateProductForm.controls['category'];
  }

  get idOffer() {
    return this.updateProductForm.controls['offer'];
  }

}
