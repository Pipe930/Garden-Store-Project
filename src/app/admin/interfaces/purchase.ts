import { DataType } from "@core/enums/dataType.enum";
import { MethodPaymentEnum } from "@core/enums/method-payment.enum";
import { StatusPurchaseEnum } from "@core/enums/statusPruchase.enum";
import { TableColumns } from "@core/interfaces/table";

interface ProductPurchase {
  idProduct: number;
  priceUnit: number;
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
  invoiceNumber: string;
  idSupplier: number;
  idEmployee: number;
  products: ProductPurchase[];
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
  status: StatusPurchaseEnum;
  discountsAplicated: number;
  methodPayment: MethodPaymentEnum;
  invoiceNumber: string;
  idSupplier: number;
  idEmployee: number;
  products: ProductPurchase[];
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
    fieldName: "action",
    dataType: DataType.ACTION,
    header: "Acciones"
  }
]
