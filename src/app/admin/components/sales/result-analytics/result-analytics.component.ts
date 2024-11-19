import { Sale, saleJson } from '@admin/interfaces/sale';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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

  ngOnInit(): void {
    this.sale.set(JSON.parse(localStorage.getItem("sale")!));
    if(JSON.parse(localStorage.getItem("analytics prediction")!)[0] === 1){
      this.isValidSale.set(true);
    } else{
      this.isValidSale.set(false);
    }
  }

  ngOnDestroy(): void {
      localStorage.removeItem('analytics prediction');
      localStorage.removeItem('sale');
  }
}
