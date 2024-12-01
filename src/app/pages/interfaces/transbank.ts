export enum TypeStatusTransbankEnum {

  AUTHORIZED = 'AUTHORIZED',
  FAILED = 'FAILED'
}

export interface TransationTransbank {
  amount: number;
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
