type PaypalLinks = {
  href: string;
  rel: string;
  method: string;
}

export interface PaypalData {
  id: string;
  status: string;
  links: PaypalLinks[];
}

export interface ResponsePaypalCreate {
  message: string;
  statusCode: number;
  data: PaypalData;
}

export interface PaypalCreate {
  amount: number;
}

export interface CommitPaypal {
  token: string;
  PayerID: string;
}
