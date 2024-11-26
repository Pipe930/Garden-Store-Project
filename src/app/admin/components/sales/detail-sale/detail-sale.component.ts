import { Sale, saleJson } from '@admin/interfaces/sale';
import { SaleService } from '@admin/services/sale.service';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeviceTranslatePipe } from '@core/pipes/device-translate.pipe';
import { AlertService } from '@core/services/alert.service';
import { delay } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-sale',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DeviceTranslatePipe, TitleCasePipe],
  templateUrl: './detail-sale.component.html',
  styleUrl: './detail-sale.component.scss'
})
export class DetailSaleComponent implements OnInit {

  private readonly _saleService = inject(SaleService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _alertService = inject(AlertService);

  private readonly idSale = this._activatedRoute.snapshot.params["id"];
  public sale = signal<Sale>(saleJson);

  ngOnInit(): void {

    this._saleService.getSale(this.idSale).subscribe((response) => {
      this.sale.set(response.data);
    });
  }

  public analyzeSale(): void {

    let timerInterval: any;
    Swal.fire({
      title: "Analizando Transacción",
      html: "Esto puede tomar unos segundos",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });

    this._saleService.analyzeSale(this.idSale).pipe(delay(5000)).subscribe((response) => {

      if(response.statusCode === HttpStatusCode.Ok){

        localStorage.setItem('analytics prediction', JSON.stringify(response.data.prediccion[0]));
        localStorage.setItem('duration prediction', JSON.stringify(response.data.duration));
        localStorage.setItem('sale', JSON.stringify(this.sale()));
        this._alertService.success('Análisis de venta', 'Se ha realizado el análisis de la venta correctamente');
        this._router.navigate(['/admin/sales/result-analysis', this.idSale]);
      };
    });

  }
}
