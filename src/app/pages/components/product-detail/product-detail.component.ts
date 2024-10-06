import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { Product, productJson } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { AlertService } from '../../../core/services/alert.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { register } from 'swiper/element';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../../environments/environment.development';
import { CardComponent } from '../../../shared/components/card/card.component';
register();

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, CardComponent, CommonModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {

  private readonly _productsService = inject(ProductsService);
  private readonly _activated = inject(ActivatedRoute);
  private readonly _cartService = inject(CartService);
  private readonly _router = inject(Router);
  private readonly _sessionService = inject(SessionService);
  private readonly _alertService = inject(AlertService);

  public swiperElement: Signal<ElementRef> = viewChild.required("swiper");

  private slug = "";
  public urlImage = signal<string>("");
  public product = signal<Product>(productJson);
  public productList = signal<Array<Product>>([]);
  public quantity = signal<number>(1);

  ngOnInit(): void {

    this._activated.params.subscribe(params => {
      this.slug = params["slug"];
    });

    this._productsService.getProduct(this.slug).subscribe(result => {
      this.product.set(result.data);
      this.loadImages(result.data);

      this._productsService.getProductsFilterCategory(result.data.idCategory).subscribe(result => {
        this.productList.set(result.data);
      })
    })
  }

  public nextSwiper():void{
    const swiperEl = this.swiperElement().nativeElement;
    swiperEl.swiper.slideNext();
  }

  public prevSwiper():void {
    const swiperEl = this.swiperElement().nativeElement;
    swiperEl.swiper.slidePrev();
  }

  public sumQuantity():void {

    if (this.product().stock >= this.quantity()) {
      this.quantity.update(value => value + 1);
    }
  }

  public subQuantity():void {
    if (1 < this.quantity()) {
      this.quantity.update(value => value - 1);
    }
  }

  public eventProductGet(productGet: Product):void {

    this.quantity.set(1);
    this.product.set(productGet);
    this.loadImages(productGet);
  }

  public addCart(id_product: number):void{


    if(!this._sessionService.validSession()){

      this._alertService.info("Debes Inciar Sesion", "Para poder agregar productos al carrito inicia sesion");
      this._router.navigate(["auth/login"]);
      return;
    }

    if(this.product().stock < this.quantity()){
      this._alertService.error("Error", "La cantidad supera al stock disponible");
      return;
    }

    const jsonProduct = {
      idProduct: id_product,
      quantity: this.quantity()
    }

    this._cartService.addProductCart(jsonProduct).subscribe(result => {

      this._alertService.toastSuccess("El producto se agrego al carrito");
      this._router.navigate(["/cart"]);
    }, (error) => {
      this._alertService.error("Error", "No se agrego el producto al carrito");
    })

  }

  private loadImages(product: Product): void{

    if(product.images.length > 0){
      this.urlImage.set(`${environment.apiImages}/${product.images.filter(image => image.type === "cover")[0].urlImage}`);
      return;
    }

    this.urlImage.set("https://cdni.iconscout.com/illustration/premium/thumb/404-7304110-5974976.png");
  }
}
