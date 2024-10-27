import { ActionsEnum } from "@core/enums/actions.enum";
import { DataType } from "@core/enums/dataType.enum";
import { ResourcesEnum } from "@core/enums/resource.enum";
import { TableColumns } from "@core/interfaces/table";

export interface Permission {

  idPermission: number;
  name: string;
  resource: ResourcesEnum;
  actions: ActionsEnum[];
}

export interface ListPermissionResponse {
  statusCode: number;
  data: Permission[];
}

export interface PermissionResponse {

  statusCode: number;
  data: Permission;
}

export interface CreatePermission {

  name: string;
  resource: ResourcesEnum;
  actions: ActionsEnum[];
}

export const columnsPermission: TableColumns[] = [

  {
    header: "Nombre",
    dataType: DataType.STRING,
    fieldName: "name"
  },
  {
    header: "Recurso",
    dataType: DataType.STRING,
    fieldName: "resource"
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: DataType.ACTION
  }
]

export const permissionJson: Permission = {
  idPermission: 0,
  name: "",
  resource: ResourcesEnum.COMMENTS,
  actions: []
}
