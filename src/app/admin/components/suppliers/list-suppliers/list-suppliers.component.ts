import { columnsSupplier, Supplier } from '@admin/interfaces/supplier';
import { SupplierService } from '@admin/services/supplier.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-suppliers',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-suppliers.component.html',
  styleUrl: './list-suppliers.component.scss'
})
export class ListSuppliersComponent implements OnInit {

  private readonly _supplierService = inject(SupplierService);
  private readonly _router = inject(Router);

  public listSuppliers = signal<Supplier[]>([]);
  public columnsSuppliers = signal<TableColumns[]>(columnsSupplier);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {

    this._supplierService.getAllSuppliers().subscribe(response => {

      if(response.statusCode === HttpStatusCode.Ok) this.listSuppliers.set(response.data);
      this.isLoading.set(false);
    })
  }

  public editSupplier(supplier: Supplier): void {

    this._router.navigate(['/admin/suppliers/update', supplier.idSupplier]);
  }
}
