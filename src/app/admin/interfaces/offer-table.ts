import { DataType, TableColumns } from "@core/interfaces/table";

export const offerColumns: Array<TableColumns> = [

  {
    header: "Titulo",
    fieldName: "title",
    dataType: DataType.STRING
  },
  {
    header: "Descuento",
    fieldName: "discount",
    dataType: DataType.NUMBER
  },
  {
    header: "Fecha Inicio",
    fieldName: "startDate",
    dataType: DataType.DATE
  },
  {
    header: "Fecha Termino",
    fieldName: "endDate",
    dataType: DataType.DATE
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: DataType.ACTION
  }
]
