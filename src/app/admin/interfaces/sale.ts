import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";
import { Order } from "./order";

export interface SaleResponse {

  statusCode: number;
  data: Sale;
}

type UserType = {

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type ProductSaleType = {

  title: string;
  price: number;
}

interface ProductsSale {

  product: ProductSaleType;
  quantity: number;
}

export interface Sale {

  idSale: string;
  idUser: string;
  idBranch: string;
  priceTotal: number;
  productsQuantity: number;
  discountApplied: number;
  deviceUsed: string;
  statusPayment: string;
  methodPayment: string;
  order: Order;
  createdAt: Date;
  updatedAt: Date;
  user: UserType;
  saleProducts: ProductsSale[];
}

export interface ListSaleResponse {

  statusCode: number;
  data: Sale[];
}

export const saleJson: Sale = {

  idSale: "",
  idUser: "",
  idBranch: "",
  priceTotal: 0,
  productsQuantity: 0,
  discountApplied: 0,
  deviceUsed: "",
  statusPayment: "",
  methodPayment: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  },
  order: {
    deliveryDate: new Date(),
    idAddress: 0,
    idOrderSale: "",
    informationShipping: "",
    shippingCost: 0,
    trackingNumber: "",
    shippingDate: new Date(),
    statusOrder: "",
    withdrawal: ""
  },
  saleProducts: []
}

export const columnsSale: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: "methodPayment",
    header: "Método de pago"
  },
  {
    dataType: DataType.DATE,
    fieldName: "createdAt",
    header: "Fecha de compra"
  },
  {
    dataType: DataType.NUMBER,
    fieldName: "priceTotal",
    header: "Precio total"
  },
  {
    dataType: DataType.NUMBER,
    fieldName: "productsQuantity",
    header: "Cantidad de productos"
  },
  {
    dataType: DataType.ACTION,
    fieldName: "action",
    header: "Acciones"
  }
]
