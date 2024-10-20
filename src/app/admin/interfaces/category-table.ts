import { TableColumns } from "@core/interfaces/table";
import { Category } from "@pages/interfaces/category";

export interface CategoriesResponse {
  statusCode: number;
  data: Category[];
}

export interface CategoryForm {
  name: string;
  description: string;
}

export interface CategoryResponse {
  statusCode: number;
  message: string;
  data: Category;
}

export const categoryColumns: Array<TableColumns> = [

  {
    header: "Nombre",
    fieldName: "name",
    dataType: "string"
  },
  {
    header: "Descripción",
    fieldName: "description",
    dataType: "string"
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: "action"
  }
]
