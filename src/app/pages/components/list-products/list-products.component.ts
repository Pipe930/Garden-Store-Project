import { Component, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Product } from '../../interfaces/product';
import { Category } from '../../interfaces/category';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  private readonly _productsService = inject(ProductsService);

  public listProducts = signal<Array<Product>>([]);
  public listCategories = signal<Array<Category>>([]);
  public currentPage = signal<number>(1);

  public nameProduct: Signal<ElementRef> = viewChild.required("searchNameProduct");
  public selectCategory: Signal<ElementRef> = viewChild.required("selectIdCategory");

  ngOnInit(): void {

    this._productsService.getAllCategories().subscribe(result => {
      this.listCategories.set(result.data);
    })

    this._productsService.getAllProducts().subscribe(result => {
      this.listProducts.set(result.data)
    })
  }

  public nextPage():void{

    this.currentPage.update(value => value + 1);
    // this._productsService.getProductsPage(this.currentPage);
  }
  public previousPage():void{

    if(this.currentPage() > 1) this.currentPage.update(value => value - 1);

    // this._productsService.getProductsPage(this.currentPage);
  }

  public searchProduct():void {

    const name_product = this.nameProduct().nativeElement;
    const id_category = this.selectCategory().nativeElement;

    let searchProduct = {
      id_category: Number.parseInt(id_category.value),
      name_product: name_product.value
    }

    // this._productsService.searchProduct(searchProduct);
  }

  get getService(){
    return this._productsService;
  }
}
