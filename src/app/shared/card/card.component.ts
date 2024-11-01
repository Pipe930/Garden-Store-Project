import { Component, inject, input, OnChanges, output, signal } from '@angular/core';
import { Product } from '@pages/interfaces/product';
import { DecimalPipe, NgClass, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ProductsService } from '@pages/services/products.service';
import { environment } from '@env/environment.development';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgOptimizedImage, NgClass, DecimalPipe, TitleCasePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges {

  private readonly _router = inject(Router);
  private readonly _productService = inject(ProductsService);
  public urlImage = signal<string>("");

  public product = input.required<Product>();
  public reload = input.required<boolean>();
  public eventProduct = output<Product>();

  ngOnChanges(): void {

    if(this.product().images){

      const image = this.product().images.filter(image => image.type === "cover")[0]
      this.urlImage.set(`${environment.apiImages}/${image.urlImage}`);
    } else {
      this.urlImage.set("https://cdni.iconscout.com/illustration/premium/thumb/404-7304110-5974976.png");
    }

  }

  public productDetail(product: Product): void {

    this._router.navigate(["product", product.slug]);

    if(this.reload()){
      this._productService.getProduct(product.slug).subscribe(result => {
        this.eventProduct.emit(result.data);
      });
    }

  }
}
