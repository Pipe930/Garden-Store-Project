import { Component, inject, input, output } from '@angular/core';
import { Product } from '../../pages/interfaces/product';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService } from '../../pages/services/products.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  private readonly _router = inject(Router);
  private readonly _productService = inject(ProductsService);

  public product = input.required<Product>();
  public reload = input.required<boolean>();
  public eventProduct = output<Product>();

  public productDetail(product: Product): void {

    this._router.navigate(["product", product.slug]);

    if(this.reload()){

      this._productService.getProduct(product.slug).subscribe(result => {
        this.eventProduct.emit(result.data);
      });
    }

  }
}
