import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

interface ListData {

  title: string;
  count: number;
  saved: string;
  backgraund: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public listData = signal<ListData[]>([]);

  ngOnInit(): void {

    this.listData.set([
      {
        title: "Ingresos Totales",
        count: 579000,
        saved: "Saved 25%",
        backgraund: "text-bg-success"
      },
      {
        title: "Gastos Totales",
        count: 200000,
        saved: "Saved 25%",
        backgraund: "text-bg-primary"
      },
      {
        title: "Usuarios Totales",
        count: 1200,
        saved: "Saved 25%",
        backgraund: "text-bg-info"
      },
      {
        title: "Ventas Totales",
        count: 3000,
        saved: "Saved 25%",
        backgraund: "text-bg-warning"
      }
    ])
  }
}
