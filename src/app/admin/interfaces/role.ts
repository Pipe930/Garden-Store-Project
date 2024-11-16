import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";
import { Permission } from "./permission";


export interface Role {
  idRole: number;
  name: string;
  permissions: Permission[];
}

export interface ListRoleResponse {

  statusCode: number;
  data: Role[];
}

export type PermissionType = {
  idPermission: number;
  name: string;
}

export interface CreateRole {
  name: string;
  permissions: PermissionType[];
}

export interface ResponseRole {
  statusCode: number;
  data: Role;
}

export const columnsRole: TableColumns[] = [
  {
    header: "Nombre",
    dataType: DataType.STRING,
    fieldName: "name"
  },
  {
    header: "Acciones",
    dataType: DataType.ACTION,
    fieldName: "action"
  }
]
