import { Offer } from '@admin/interfaces/offer';
import { CategoryService } from '@admin/services/category.service';
import { OfferService } from '@admin/services/offer.service';
import { ProductService } from '@admin/services/product.service';
import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@env/environment.development';
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
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _alertService = inject(AlertService);
  private readonly _builder = inject(FormBuilder);
  private readonly _categoryService = inject(CategoryService);
  private readonly _offerService = inject(OfferService);

  public imageProduct = viewChild.required<ElementRef>('imageProduct');
  public imagePreview = viewChild.required<ElementRef>('imagePreview');

  public listCategories = signal<Category[]>([]);
  public listOffers = signal<Offer[]>([]);
  public product = signal<Product>(productJson);
  private idProduct = this._activatedRoute.snapshot.params["id"];

  private newImageBase64 = "";
  private newImageName = "";
  private imageBase64 = "";
  private nameImage = "";
  private type = "";

  public updateProductForm: FormGroup = this._builder.group({

    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    price: this._builder.control(0, [Validators.required, Validators.min(1000)]),
    brand: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    returnPolicy: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    thumbnail: this._builder.control(''),
    published: this._builder.control(false),
    category: this._builder.control('', Validators.required),
    offer: this._builder.control(''),
    description: this._builder.control('', Validators.maxLength(255)),
  });

  ngOnInit(): void {

    this._categoryService.getAllCategories().subscribe((response) => {
      this.listCategories.set(response.data);
    });

    this._offerService.getAllOffers().subscribe((response) => {
      this.listOffers.set(response.data);
    });

    this._productService.getProduct(this.idProduct).subscribe((product) => {

      const categoryObtain = this.listCategories().filter((category) => category.name == product.data.category.name);

      this._productService.getImageProduct(this.idProduct).subscribe((image) => {

        this.imageBase64 = image.data.image;
        this.nameImage = image.data.filename;
        this.type = image.data.type;
        this.imagePreview().nativeElement.src = `data:${this.type};base64,${this.imageBase64}`;
      })

      this.product.set(product.data);
      this.updateProductForm.get("title")?.setValue(product.data.title);
      this.updateProductForm.get("brand")?.setValue(product.data.brand);
      this.updateProductForm.get("price")?.setValue(product.data.price);
      this.updateProductForm.get("published")?.setValue(product.data.published);
      this.updateProductForm.get("returnPolicy")?.setValue(product.data.returnPolicy);
      this.updateProductForm.get("description")?.setValue(product.data.description);
      this.updateProductForm.get("category")?.setValue(categoryObtain[0].idCategory.toString());
      if(product.data.offer){

        const offerObtain = this.listOffers().filter((offer) => offer.title === product.data.offer.title);
        this.updateProductForm.get("offer")?.setValue(offerObtain[0].idOffer.toString());
      }
      this.updateProductForm.updateValueAndValidity();
    });
  }

  public updateProduct(): void {

    if (this.updateProductForm.invalid) {
      this.updateProductForm.markAllAsTouched();
      return;
    }

    const { thumbnail, category, offer, ...forms } = this.updateProductForm.value;

    if(thumbnail !== ""){

      const [filename, imageBase64] = this.newImageBase64.split(',');

      this._productService.uploadImage({
        file: imageBase64,
        filename: this.newImageName,
        typeFormat: filename.split(';')[0].split(':')[1],
        type: 'cover',
        idProduct: parseInt(this.idProduct)
      }).subscribe(() => {});
    }

    this._productService.updateProduct(      {
      ...forms,
      idCategory: parseInt(category),
      idOffer: offer ? parseInt(offer) : null
    }, this.idProduct).subscribe((response) => {

      this._alertService.success("Producto actualizado", "El producto se ha actualizado correctamente");
      this._router.navigate(["/admin/products/list"]);
    });
  }

  public changeImage(){

    const imageProduct = this.imageProduct().nativeElement;
    const imagePreview = this.imagePreview().nativeElement;

    if (imageProduct instanceof HTMLInputElement && imageProduct.files && imageProduct.files.length > 0) {

      const archivo = imageProduct.files[0];
      const src = URL.createObjectURL(imageProduct.files[0]);

      this.newImageName = archivo.name;
      imagePreview.src = src;

      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onload = () => {
        this.newImageBase64 = reader.result as string;
      }
      return;
    }

    imagePreview.src = "/assets/imgs/upload-image_2023-04-11-023334_kxuh.png";
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

  get thumbnail() {
    return this.updateProductForm.controls['thumbnail'];
  }

}
