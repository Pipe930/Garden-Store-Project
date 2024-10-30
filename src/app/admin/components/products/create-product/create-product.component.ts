import { CategoryService } from '@admin/services/category.service';
import { ProductService } from '@admin/services/product.service';
import { NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Category } from '@pages/interfaces/category';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {

  private readonly _productService = inject(ProductService);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);
  private readonly _builder = inject(FormBuilder);
  private readonly _categoryService = inject(CategoryService);

  public listCategories = signal<Category[]>([]);
  public alertMessage = signal<boolean>(false);
  public imageProduct = viewChild.required<ElementRef>('imageProduct');
  public imagePreview = viewChild.required<ElementRef>('imagePreview');
  private imageBase64 = "";
  private nameImage = "";

  public formProduct: FormGroup = this._builder.group({

    title: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    price: this._builder.control(0, [Validators.required, Validators.min(1000)]),
    brand: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
    returnPolicy: this._builder.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]),
    description: this._builder.control('', Validators.maxLength(255)),
    thumbnail: this._builder.control('', Validators.required),
    category: this._builder.control('', Validators.required),
    offer: this._builder.control('')
  });

  ngOnInit(): void {
    this._categoryService.getAllCategories().subscribe(result => {
      this.listCategories.set(result.data);
    });
  }

  public createProduct(): void {


    if (this.formProduct.invalid) {
      this.formProduct.markAllAsTouched();
      return;
    }

    const { thumbnail, category, offer, ...forms } = this.formProduct.value;
    const [filename, imageBase64] = this.imageBase64.split(',');

    this._productService.createProduct(
      {
        ...forms,
        idCategory: parseInt(category),
        idOffer: offer ? parseInt(offer) : null,
      }
    ).pipe(

      catchError(error => {
        if(error.status === HttpStatusCode.Conflict){
          this.alertMessage.set(true);
          const timer = setTimeout(() => {
            this.alertMessage.set(false);
          }, 5000);
          clearTimeout(timer);
        }
        this._alertService.error("Error al crear el producto", "No se pudo crear el producto");
        return of();
      }
    )).subscribe(result => {

      this._productService.uploadImage(
        {
          file: imageBase64,
          filename: this.nameImage,
          typeFormat: filename.split(';')[0].split(':')[1],
          type: "cover",
          idProduct: result.data.idProduct
        }
      ).subscribe(() => {
        this._alertService.success("Carga Imagenes", "Las imagenes se guardaron correctamente");
      });
      this._router.navigate(['/admin/products/list']);
      this._alertService.success("Producto Creado", "El producto se creo correctamente");
    });
  }

  public changeImage(){

    const imageProduct = this.imageProduct().nativeElement;
    const imagePreview = this.imagePreview().nativeElement;

    if (imageProduct instanceof HTMLInputElement && imageProduct.files && imageProduct.files.length > 0) {

      const archivo = imageProduct.files[0];
      const src = URL.createObjectURL(imageProduct.files[0]);

      this.nameImage = archivo.name;
      imagePreview.src = src;

      const reader = new FileReader();
      reader.readAsDataURL(archivo);

      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      }
      return;
    }

    imagePreview.src = "/assets/imgs/upload-image_2023-04-11-023334_kxuh.png";
  }

  get title() {
    return this.formProduct.controls["title"];
  }

  get price() {
    return this.formProduct.controls['price'];
  }

  get brand() {
    return this.formProduct.controls['brand'];
  }

  get returnPolicy() {
    return this.formProduct.controls['returnPolicy'];
  }

  get description() {
    return this.formProduct.controls['description'];
  }

  get idCategory() {
    return this.formProduct.controls['idCategory'];
  }

  get idOffer() {
    return this.formProduct.controls['idOffer'];
  }

  get thumbnail() {
    return this.formProduct.controls['thumbnail'];
  }

}
