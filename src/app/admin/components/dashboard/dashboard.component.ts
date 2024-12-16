import { Sale } from '@admin/interfaces/sale';
import { ProductService } from '@admin/services/product.service';
import { SaleService } from '@admin/services/sale.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '@pages/interfaces/product';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public grafth1!: Chart;
  public grafth2!: Chart;

  private readonly _productsService = inject(ProductService);
  private readonly _saleService = inject(SaleService);

  public listProducts = signal<Product[]>([]);
  public listNamesProduct = signal<string[]>([]);
  public listSoldProduct = signal<number[]>([]);
  public listSales = signal<Sale[]>([]);

  ngOnInit(): void {

    this._saleService.getAllSales().subscribe(response => {

      this.listSales.set(response.data);
    })

    this._productsService.getAllProductsAnalytics().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok){
        this.listProducts.set(response.data);

        this.listProducts().forEach(product => {
          this.listNamesProduct().push(product.title);
          this.listSoldProduct().push(product.sold);
        });

        const dataProduct = {
          labels: this.listNamesProduct(),
          datasets: [{
            label: 'Cantidad Vendida',
            data: this.listSoldProduct(),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        };

        const dataSale = {
          labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
          datasets: [{
            label: 'Precio Total',
            data: [346700, 256000, 140600, 567000, 456800, 780780, 379600],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        };

        this.grafth1 = new Chart("grafico1", {
          type: "bar" as ChartType,
          data: dataProduct,
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })


        this.grafth2 = new Chart("grafico2", {
          type: "line" as ChartType,
          data: dataSale,
          options: {
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      };
    })


  }
}
