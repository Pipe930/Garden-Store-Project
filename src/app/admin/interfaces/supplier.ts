import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";


export interface Supplier {

  idSupplier: number;
  name: string;
  phone: string;
  email: string;
  rating: number;
  website?: string;
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

  name: string;
  phone: string;
  email: string;
  rating: number;
  website?: string;
}

export const columnsSupplier: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: 'name',
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
    fieldName: 'rating',
    header: 'Rating',
  },
  {
    dataType: DataType.ACTION,
    fieldName: 'action',
    header: 'Acciones',
  }
]
