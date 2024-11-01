import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";

export enum StatusPurchaseEnum {

  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED'
}

export enum MethodPaymentEnum {

  CREDIT_CARD = 'Tarjeta de crédito',
  DEBIT_CARD = 'Tarjeta de débito',
  PAYPAL = 'Paypal',
  MERCADO_PAGO = 'Mercado Pago',
  TRANSFER = 'Transferencia',
  CASH = 'Efectivo'
}

interface ProductPurchase {
  idProduct: number;
  quantity: number;
}

export interface Purchase {

  idPurchase: number;
  quantityTotal: number;
  totalPrice: number;
  ivaPrice: number;
  status: string;
  discountsAplicated: number;
  methodPayment: string;
  invoiveNumber: string;
  idSupplier: number;
  idEmployee: number;
  listProducts: ProductPurchase[];
}

export interface ListPurchaseResponse {

  statusCode: number;
  message: string;
  data: Purchase[];
}

export interface CreatePurchase {

  quantityTotal: number;
  totalPrice: number;
  ivaPrice: number;
  status: string;
  discountsAplicated: number;
  methodPayment: string;
  invoiveNumber: string;
  idSupplier: number;
  idEmployee: number;
  listProducts: ProductPurchase[];
}

export const columnsPurchase: TableColumns[] = [

  {
    fieldName: "status",
    dataType: DataType.STRING,
    header: "Estado"
  },
  {
    fieldName: "quantityTotal",
    dataType: DataType.NUMBER,
    header: "Cantidad total"
  },
  {
    fieldName: "totalPrice",
    dataType: DataType.NUMBER,
    header: "Precio total"
  },
  {
    fieldName: "methodPayment",
    dataType: DataType.STRING,
    header: "Método de pago"
  },
  {
    fieldName: "actions",
    dataType: DataType.ACTION,
    header: "Acciones"
  }
]
