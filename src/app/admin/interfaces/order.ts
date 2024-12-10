import { DataType } from "@core/enums/dataType.enum";
import { OrderStatusEnum } from "@core/enums/orderStatus.enum";
import { TableColumns } from "@core/interfaces/table";

export interface Order {

  idOrderSale: string;
  informationShipping: string;
  shippingDate: Date;
  deliveryDate: Date;
  trackingNumber: string;
  withdrawal: string;
  statusOrder: string;
  shippingCost: number;
  idAddress: number;
}

export interface ListOrderResponse {
  data: Order[];
  statusCode: number;
}

export interface OrderResponse {
  data: Order;
  statusCode: number;
}

export interface OrderUpdate {

  informationShipping: string;
  status: OrderStatusEnum;
  trackingNumber: string;
  shippingCost: number;
}

export const orderJson: Order = {

  idOrderSale: '',
  informationShipping: '',
  statusOrder: "",
  withdrawal: "",
  shippingDate: new Date(),
  deliveryDate: new Date(),
  trackingNumber: '',
  shippingCost: 0,
  idAddress: 0
}

export const columnsOrders: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: 'informationShipping',
    header: 'Información de envío',
  },
  {
    dataType: DataType.DATE,
    fieldName: 'shippingDate',
    header: 'Fecha de envío',
  },
  {
    dataType: DataType.DATE,
    fieldName: 'deliveryDate',
    header: 'Fecha de entrega',
  },
  {
    dataType: DataType.NUMBER,
    fieldName: 'shippingCost',
    header: 'Costo de envío',
  },
  {
    dataType: DataType.ACTION,
    fieldName: 'action',
    header: 'Acciones',
  }
]
