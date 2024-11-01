export interface Offer {

  idOffer: number;
  title: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  description: string;
}

export interface ResponseOffers {
  statusCode: number;
  data: Offer[];
}

export interface ResponseOffer {
  statusCode: number;
  data: Offer;
}

export interface CreateOfferForm {

  title: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  description: string;
}

export const offerJson: Offer = {
  idOffer: 0,
  title: "",
  startDate: new Date(),
  endDate: new Date(),
  discount: 0,
  description: ""
}
