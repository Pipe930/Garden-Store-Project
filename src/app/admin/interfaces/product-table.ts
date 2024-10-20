import { TableColumns } from "@core/interfaces/table";
import { Product } from "@pages/interfaces/product";

export interface ProductsResponse {
  statusCode: number;
  data: Product[];

}

export interface CreateProductForm {
  title: string;
  price: number;
  brand: string;
  returnPolicy: string;
  description: string;
  idCategory: number;
  idOffer: number | null;
}

export interface UpdateProductForm {
  title: string;
  price: number;
  brand: string;
  returnPolicy: string;
  description: string;
  published: boolean;
  idCategory: number;
  idOffer: number | null;
}

export interface ProductResponse {
  statusCode: number;
  message: string;
  data: Product;
}

export const productColumns: Array<TableColumns> = [

  {
    header: "Titulo",
    fieldName: "title",
    dataType: "string"
  },
  {
    header: "Precio",
    fieldName: "price",
    dataType: "number"
  },
  {
    header: "Stock",
    fieldName: "stock",
    dataType: "number"
  },
  {
    header: "Publicado",
    fieldName: "published",
    dataType: "boolean"
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: "action"
  }
]
