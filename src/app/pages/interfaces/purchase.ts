import { Address } from "./address";

export interface CreatePurchase {

  withdrawal: string;
  address?: number;
  branch?: number;
}

export interface Purchase {

  createAt: Date;
  updateAt: Date;
  priceNet: number;
  priceIva: number;
  priceTotal: number;
  discountApplied: number;
  productsQuantity: number;
  status: string;
  withdrawal: string;
  user: number;
}

export interface ResponseListPurchase {

  status: string;
  count: number;
  data: Array<Purchase>;
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

export const enum TypeStatusTransbankEnum {

  AUTHORIZED = 'AUTHORIZED',
  FAILED = 'FAILED'
}

export const enum TypePaimentEnum {
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

type TypePerson = {

  selected: string;
}

type TypeRetirement = {
  retirement: string;
}

type TypePay = {
  payment: string;
}

type TypeBranch = {
  id_branch: string;
}

export interface Voucher {

  address: Address;
  type_person: TypePerson;
  type_retirement: TypeRetirement;
  type_pay: TypePay;
  branch: TypeBranch;
}


export const VoucherObject: Voucher = {
  address: {
    address: {
      idAddress: 0,
      name: "",
      addressName: "",
      city: "",
      description: "",
      commune: {
        idCommune: 0,
        name: ""
      }
    },
    idAddress: 0,
    idAddressUser: 0,
    idUser: 0
  },
  type_person: {
    selected: ""
  },
  type_retirement: {
    retirement: ""
  },
  type_pay: {
    payment: ""
  },
  branch: {
    id_branch: ""
  }
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
