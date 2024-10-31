import { Address } from "./address";

export interface Purchase {

  idSale: string;
  priceNet: number;
  priceIva: number;
  priceTotal: number;
  discountApplied: number;
  productsQuantity: number;
  status: string;
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

  STORE_PICKUP = 'EN TIENDA',
  HOME_DELIVERY = 'A DOMICILIO'
}

export enum TypeStatusTransbankEnum {

  AUTHORIZED = 'AUTHORIZED',
  FAILED = 'FAILED'
}

export enum TypePaimentEnum {
  DEBIT_CARD = 'debit-card',
  CREDIT_CARD = 'credit-card',
  MARKET_PAYMENT = 'market-payment'
}

export interface TransationTransbank {

  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
}

type TypeDataTransbank = {
  token: string;
  url: string;
}

export interface ResponseTransbank {

  status: string;
  data: TypeDataTransbank;
}

type CardDetail = {

  card_number: string;
}

export interface ConfirmTransbank {

  accounting_date: string;
  amount: number;
  authorization_code: string;
  buy_order: string;
  card_detail: CardDetail;
  installments_number: number;
  payment_type_code: string;
  response_code: number;
  session_id: string;
  status: string;
  transaction_date: string;
  vci: string;
}

export interface ResponseConfirmTransbank{

  status: string;
  data: ConfirmTransbank
}

export interface Voucher {

  address: Address;
  typePerson: string;
  typeRetirement: string;
  typePay: string;
  idBranch: number;
  totalPrice: number;
  productsQuantity: number;
  discountApplied: number;
}

export interface CreateVoucher {
  productsQuantity: number;
  priceTotal: number;
  discountApplied: number;
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
  typeRetirement: "",
  typePay: "",
  idBranch: 0,
  productsQuantity: 0,
  totalPrice: 0,
  discountApplied: 0
}

export const TransbankInfo: ConfirmTransbank = {

  accounting_date: "",
  amount: 0,
  authorization_code: "",
  buy_order: "",
  card_detail: {
    card_number: ""
  },
  installments_number: 0,
  payment_type_code: "",
  response_code: 0,
  session_id: "",
  status: "",
  transaction_date: "",
  vci: ""
}
