type SaleProductType = {
  quantity: number;
  product: {
    title: string;
    price: number;
  };
}

type ShippingType = {
  idShippingSale: string;
  informationShipping: string;
  shippingDate: string;
  deliveryDate: string;
  trackingNumber: string;
  shippingCost: number;
  idAddress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {

  idSale: string;
  priceNet: number;
  priceIva: number;
  priceTotal: number;
  methodPayment: string;
  deviceUsed: string;
  discountApplied: number;
  productsQuantity: number;
  statusOrder: string;
  withdrawal: string;
  statusPayment: string;
  idUser: number;
  idBranch: number;
  createdAt: string;
  updatedAt: string;
  saleProducts: SaleProductType[];
  shipping: ShippingType;
}

export interface ListPurchaseResponse {

  data: Purchase[];
  message: string;
  statusCode: number;
}

export interface PurchaseResonse {

  data: Purchase;
  statusCode: number;
}
