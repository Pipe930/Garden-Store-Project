import { productColumns } from '@admin/interfaces/product-table';
import { ProductService } from '@admin/services/product.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { Product } from '@pages/interfaces/product';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {

  private readonly _router = inject(Router);
  private readonly _productService = inject(ProductService);

  public listProducts = signal<Product[]>([]);
  public columns = signal<TableColumns[]>(productColumns);
  public isLoading = signal<boolean>(false);

  ngOnInit(): void {

    this._productService.getAllProducts().subscribe(result => {
      if(result.statusCode === HttpStatusCode.Ok) this.listProducts.set(result.data);
      this.isLoading.set(true);
    })
  }

  public editProduct(event: Product):void{
    this._router.navigate(["/admin/products/edit", event.idProduct]);
  }

}
