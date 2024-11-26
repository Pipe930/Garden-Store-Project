import { Sale, saleJson } from '@admin/interfaces/sale';
import { SaleService } from '@admin/services/sale.service';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-result-analytics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './result-analytics.component.html',
  styleUrl: './result-analytics.component.scss'
})
export class ResultAnalyticsComponent implements OnInit, OnDestroy {

  public sale = signal<Sale>(saleJson);
  public isValidSale = signal<boolean>(false);
  private readonly _saleService = inject(SaleService);

  ngOnInit(): void {
    this.sale.set(JSON.parse(localStorage.getItem("sale")!));
    if(JSON.parse(localStorage.getItem("analytics prediction")!) === 1){
      this.isValidSale.set(true);
    } else{
      this.isValidSale.set(false);
    }
  }

  ngOnDestroy(): void {
      localStorage.removeItem('analytics prediction');
      localStorage.removeItem('duration prediction');
      localStorage.removeItem('sale');
  }

  public generatePDF(): void {

    this._saleService.generatePDF(this.sale().idSale, JSON.parse(localStorage.getItem("duration prediction")!), JSON.parse(localStorage.getItem("analytics prediction")!)).subscribe(        (response: Blob) => {
      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, '_blank');
    },
    (error) => {
      console.error('Error al generar el PDF:', error);
    })
  }
}
