import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';
import { Cart, cartJson } from 'src/app/core/interfaces/cart';
import { Images } from 'src/app/core/interfaces/product';
import { CartService } from 'src/app/core/services/cart.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonTitle,
    IonItem,
    IonThumbnail,
    IonImg,
    IonButton,
    IonIcon,
    IonList,
    IonLabel,
    IonButtons,
    DecimalPipe,
    HeaderComponent,
    RouterLink
  ]
})
export class CartPage implements OnInit {

  private readonly cartService = inject(CartService);

  public cart = signal<Cart>(cartJson);
  public isLoading = signal<boolean>(false);
  public urlImage = signal<string>(environment.apiImages);

  constructor() {
    addIcons({
      addOutline,
      removeOutline
    })
  }

  ngOnInit(): void {
    this.updateCart();
  }

  public updateCart():void {

    this.cartService.getCartUser();
    this.cartService.cartCurrent$.subscribe(result => {
      this.cart.set(result);
    })

    this.cartService.isLoading.subscribe(result => {
      this.isLoading.set(result);
    })
  }

  public substractProduct(idProduct: number):void{

    const json = {
      idProduct
    }

    this.cartService.substractProductCart(json).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })

  }

  public addProduct(idProduct: number):void {

    const json = {
      idProduct,
      quantity: 1
    }

    this.cartService.addProductCart(json).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })

  }

  public removeProduct(idProduct: number):void {

    this.cartService.removeProductCart(idProduct).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })
  }

  public clearCart():void {
    this.cartService.clearCart().subscribe(() => {
      this.updateCart();
    })
  }

  public getImageProduct(images: Images[]): string {

    if(images.length !== 0)
      return images.filter((image) => image.type === 'cover')[0].urlImage
    else return "";

  }

}
