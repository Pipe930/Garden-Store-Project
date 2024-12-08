import { Address } from "./address";

export interface Purchase {

  idSale: string;
  priceNet: number;
  priceIva: number;
  priceTotal: number;
  discountApplied: number;
  productsQuantity: number;
  statusPayment: string;
  idUser: number;
  createdAt: Date;
  updatedAt: Date;
  saleProducts: PurchaseProduct[];
  shipping: null;
}

interface ProductPurchase {
  title: string;
  price: number;
}

export interface PurchaseProduct {
  product: ProductPurchase;
  quantity: number;
}

export interface ResponseListUserPurchase {
  status: number;
  data: Purchase[];
}

export interface ResponseListPurchase {

  status: string;
  count: number;
  data: Purchase[];
}

export enum TypeStatusEnum {

  PENDING = 'PENDIENTE',
  PAID = 'PAGADO',
  CANCELED = 'CANCELADO'
}

export enum TypeRetirementEnum {

  STORE_PICKUP = 'RETIRO EN TIENDA',
  HOME_DELIVERY = 'DESPACHO A DOMICILIO'
}

export interface Voucher {

  address: Address;
  typePerson: string;
  typeRetirement: TypeRetirementEnum;
  typePay: string;
  idBranch: number;
  totalPrice: number;
  productsQuantity: number;
  discountApplied: number;
}

export interface VoucherConfirm {

  address: Address;
  typePerson: string;
  typePay: string;
  typeRetirement: TypeRetirementEnum;
  shippingCost: number;
  idSale: number;
}

export interface Shipping {

  informationShipping: string;
  shippingCost: number;
  idAddress: number;
}

export interface UpdateVoucher {

  status: string;
  methodPayment: string;
  shipping?: Shipping;
}

export interface CreateVoucher {

  withdrawal: string;
  productsQuantity: number;
  priceTotal: number;
  discountApplied: number;
  idBranch?: number;
}


export const VoucherObject: Voucher = {
  address: {
    address: {
      idAddress: 0,
      addressName: "",
      city: "",
      description: "",
      commune: {
        idCommune: 0,
        name: ""
      }
    },
    name: "",
    idAddress: 0,
    idAddressUser: 0,
    idUser: 0
  },
  typePerson: "",
  typeRetirement: TypeRetirementEnum.STORE_PICKUP,
  typePay: "",
  idBranch: 0,
  productsQuantity: 0,
  totalPrice: 0,
  discountApplied: 0
}
