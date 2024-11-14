import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";


export interface Supplier {

  idSupplier: number;
  fullName: string;
  rut: string;
  phone: string;
  email: string;
  idAddress: number;
}

export interface ListSuppliersResponse {

  statusCode: number;
  message: string;
  data: Supplier[];
}

export interface SupplierResponse {

  statusCode: number;
  message: string;
  data: Supplier;
}

export interface CreateSupplier {

  fullName: string;
  rut: string;
  phone: string;
  email: string;
  idAddress: number;
}

export const columnsSupplier: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: 'fullName',
    header: 'Nombre',
  },
  {
    dataType: DataType.STRING,
    fieldName: 'phone',
    header: 'Teléfono',
  },
  {
    dataType: DataType.STRING,
    fieldName: 'email',
    header: 'Correo',
  },
  {
    dataType: DataType.NUMBER,
    fieldName: 'rut',
    header: 'Rut',
  },
  {
    dataType: DataType.ACTION,
    fieldName: 'action',
    header: 'Acciones',
  }
]
