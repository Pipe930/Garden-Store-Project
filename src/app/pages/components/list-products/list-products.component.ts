import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '@shared/card/card.component';
import { Product } from '@pages/interfaces/product';
import { Category } from '@pages/interfaces/category';
import { ProductsService } from '@pages/services/products.service';
import { ViewportScroller } from '@angular/common';
import { SearchComponent } from '@shared/search/search.component';
import { SearchInterface } from '@core/interfaces/search';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CardComponent, SearchComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent implements OnInit {

  private readonly _productsService = inject(ProductsService);
  private readonly _viewportScroller = inject(ViewportScroller);

  public listProducts = signal<Array<Product>>([]);
  public listCategories = signal<Array<Category>>([]);
  public currentPage = signal<number>(1);
  public isLoading = signal<boolean>(false);

  ngOnInit(): void {

    this._productsService.$isLoading.subscribe(result => {
      this.isLoading.set(result);
    });

    this._productsService.getAllCategories().subscribe(result => {
      this.listCategories.set(result.data);
    })

    this._productsService.getAllProducts();
    this._productsService.products$.subscribe(result => {
      this.listProducts.set(result);
    })
  }

  public nextPage():void{

    this.currentPage.update(value => value + 1);
    this._productsService.getProductsPage(this.currentPage());
    this._viewportScroller.scrollToPosition([0, 0]);
  }

  public previousPage():void{

    if(this.currentPage() > 1) this.currentPage.update(value => value - 1);
    this._productsService.getProductsPage(this.currentPage());
    this._viewportScroller.scrollToPosition([0, 0]);
  }

  public searchProduct(objectSearch: SearchInterface):void {
    this._productsService.searchProduct(objectSearch.nameProduct, objectSearch.idCategory);
  }

  get getService(){
    return this._productsService;
  }
}
