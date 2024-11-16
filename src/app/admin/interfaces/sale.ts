export interface Sale {

  idSale: string;
  statusOrder: string;
}

export interface SaleResponse {

  statusCode: number;
  data: Sale;
}
