import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";

type ProductQuantityType = {
  quantity: number;
}

export type ProductBranchType = {
  idProduct: number;
  title: string;
  ProductBranch: ProductQuantityType;
}

export interface Branch {

  idBranch: number;
  name: string;
  tradeName: string;
  postalCode: string;
  email: string;
  phone: string;
  openingDate: Date;
  capacity: number;
  capacityOccupied: number;
  status: boolean;
  idAddress: number;
  products: Array<ProductBranchType>;
  employees: Array<any>;
}

export interface ListBranchResponse {

  statusCode: number;
  data: Branch[];
}

export interface BranchResponse {

  statusCode: number;
  data: Branch;
}

export interface CreateBranch {

  name: string;
  tradeName: string;
  postalCode: string;
  email: string;
  phone: string;
  openingDate: Date;
  capacity: number;
  idAddress: number;
}

export interface CreateProductBranchForm {

  idBranch: number;
  products: ProductBranchType[];
}

export const branchJson: Branch = {

  idBranch: 0,
  name: "",
  tradeName: "",
  postalCode: "",
  email: "",
  phone: "",
  openingDate: new Date(),
  capacity: 0,
  capacityOccupied: 0,
  status: false,
  idAddress: 0,
  products: [],
  employees: []
}

export const branchColumns: Array<TableColumns> = [

  {
    header: "Nombre",
    fieldName: "name",
    dataType: DataType.STRING
  },
  {
    header: "Correo",
    fieldName: "email",
    dataType: DataType.STRING
  },
  {
    header: "Telefono",
    fieldName: "phone",
    dataType: DataType.STRING
  },
  {
    header: "Capacidad Ocupada",
    fieldName: "capacityOccupied",
    dataType: DataType.NUMBER
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: DataType.ACTION
  }
]


