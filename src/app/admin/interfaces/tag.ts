import { DataType } from "@core/enums/dataType.enum";
import { TableColumns } from "@core/interfaces/table";

export interface Tag {

  idTag: number;
  name: string;
  slug: string;
  description: string;
}

export interface ListTagsResponse {

  statusCode: number;
  data: Tag[];
}

export interface TagResponse {
  statusCode: number;
  data: Tag;
}

export interface CreateTag {
    name: string;
    description: string;
}

export const tagColumns: TableColumns[] = [

  {
    dataType: DataType.STRING,
    fieldName: 'name',
    header: 'Nombre'
  },
  {
    dataType: DataType.ACTION,
    fieldName: 'action',
    header: 'Acciones'
  }
]
