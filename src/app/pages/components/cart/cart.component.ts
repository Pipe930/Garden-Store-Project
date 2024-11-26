import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart, cartJson } from '../../interfaces/cart';
import { RouterLink } from '@angular/router';
import { DecimalPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  private readonly _cartService = inject(CartService);

  public cart = signal<Cart>(cartJson);
  public isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.updateCart();
  }

  public updateCart():void{
    this._cartService.getCartUser();
    this._cartService.cartCurrent$.subscribe(result => {
      this.cart.set(result);
    })

    this._cartService.isLoading.subscribe(result => {
      this.isLoading.set(result);
    })
  }

  public substractProduct(id_product: number):void{

    const json = {
      idProduct: id_product
    }

    this._cartService.substractProductCart(json).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })

  }

  public addProduct(id_product: number):void {
    const json = {
      idProduct: id_product,
      quantity: 1
    }

    this._cartService.addProductCart(json).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })

  }

  public removeProduct(id_product: number):void {

    this._cartService.removeProductCart(id_product).subscribe(result => {
      if(result){
        this.updateCart();
      }
    })
  }

  public clearCart():void{
    this._cartService.clearCart().subscribe(() => {
      this.updateCart();
    })
  }
}
