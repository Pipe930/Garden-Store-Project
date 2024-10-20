import { Routes } from '@angular/router';
import { ListOffersComponent } from './list-offers/list-offers.component';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { UpdateOfferComponent } from './update-offer/update-offer.component';

export const routesOffers: Routes = [

  {
    path: "list",
    component: ListOffersComponent
  },
  {
    path: "create",
    component: CreateOfferComponent
  },
  {
    path: "edit/:id",
    component: UpdateOfferComponent
  }
];
