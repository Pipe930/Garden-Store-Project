import { DataType, TableColumns } from "@core/interfaces/table";

export const userColumns: TableColumns[] = [
  {
    header: "Nombre",
    fieldName: "firstName",
    dataType: DataType.STRING
  },
  {
    header: "Apellido",
    fieldName: "lastName",
    dataType: DataType.STRING
  },
  {
    header: "Correo",
    fieldName: "email",
    dataType: DataType.STRING
  },
  {
    header: "Cuenta Activa",
    fieldName: "active",
    dataType: DataType.BOOLEAN
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: DataType.ACTION
  }
]
