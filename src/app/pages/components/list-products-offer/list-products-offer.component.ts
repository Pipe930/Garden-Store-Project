import { ViewportScroller } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { SearchInterface } from '@core/interfaces/search';
import { Category } from '@pages/interfaces/category';
import { Product } from '@pages/interfaces/product';
import { ProductsService } from '@pages/services/products.service';
import { CardComponent } from '@shared/card/card.component';
import { SearchComponent } from '@shared/search/search.component';

@Component({
  selector: 'app-list-products-offer',
  standalone: true,
  imports: [CardComponent, SearchComponent],
  templateUrl: './list-products-offer.component.html',
  styleUrl: './list-products-offer.component.scss'
})
export class ListProductsOfferComponent {

  private readonly _productsService = inject(ProductsService);
  private readonly _viewportScroller = inject(ViewportScroller);

  public listProducts = signal<Product[]>([]);
  public listCategories = signal<Category[]>([]);
  public currentPage = signal<number>(1);
  public isLoading = signal<boolean>(false);

  ngOnInit(): void {

    this._productsService.getAllCategories().subscribe(result => {
      this.listCategories.set(result.data);
    });

    this._productsService.getAllProductsOffer().subscribe(result => {
      if(result.statusCode === HttpStatusCode.Ok) this.listProducts.set(result.data);
      this.isLoading.set(true);
    })

    // this._productsService.getAllProducts();
    // this._productsService.products$.subscribe(result => {
    //   this.listProducts.set(result);
    //   this.isLoading.set(true);
    // })
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
