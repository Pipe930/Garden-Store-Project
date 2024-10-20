import { Offer } from '@admin/interfaces/offer';
import { offerColumns } from '@admin/interfaces/offer-table';
import { OfferService } from '@admin/services/offer.service';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableColumns } from '@core/interfaces/table';
import { TableComponent } from '@shared/table/table.component';

@Component({
  selector: 'app-list-offers',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './list-offers.component.html',
  styleUrl: './list-offers.component.scss'
})
export class ListOffersComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _offerService = inject(OfferService);
  public listOffers = signal<Offer[]>([]);
  public columns = signal<TableColumns[]>(offerColumns);

  ngOnInit(): void {
    this._offerService.getAllOffers().subscribe(response => {
      if(response.statusCode === HttpStatusCode.Ok) this.listOffers.set(response.data);
    })
  }

  public editOffer(event: Offer):void{
    this._router.navigate(["/admin/offers/edit", event.idOffer]);
  }
}
