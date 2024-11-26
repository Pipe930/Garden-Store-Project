import { columnsSale, Sale } from '@admin/interfaces/sale';
import { SaleService } from '@admin/services/sale.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-sales',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './list-sales.component.html',
  styleUrl: './list-sales.component.scss'
})
export class ListSalesComponent implements OnInit {

  private readonly _saleService = inject(SaleService);
  private readonly _router = inject(Router);

  public listSales = signal<Sale[]>([]);
  public columnsSale = signal<TableColumns[]>(columnsSale);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {

    this._saleService.getAllSales().subscribe((response) => {
      if(response.statusCode === HttpStatusCode.Ok) this.listSales.set(response.data);
      this.isLoading.set(false);
    })
  }

  public editSale(sale: Sale): void {
    this._router.navigate(["/admin/sales/detail/", sale.idSale]);
  }

}
