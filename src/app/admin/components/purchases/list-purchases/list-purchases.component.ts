import { columnsPurchase, Purchase } from '@admin/interfaces/purchase';
import { PurchaseService } from '@admin/services/purchase.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-purchases',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-purchases.component.html',
  styleUrl: './list-purchases.component.scss'
})
export class ListPurchasesComponent implements OnInit {

  private readonly _purchaseService = inject(PurchaseService);
  public listPurchases = signal<Purchase[]>([]);
  public columnsPurchase = signal<TableColumns[]>(columnsPurchase);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this._purchaseService.getAllPurchase().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listPurchases.set(response.data);

      this.isLoading.set(false);
    });
  }

  public editPurchase(purchase: Purchase): void{

  }
}
