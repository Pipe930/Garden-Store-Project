import { DataType, TableColumns } from "@core/interfaces/table";
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
    dataType: DataType.STRING
  },
  {
    header: "Precio",
    fieldName: "price",
    dataType: DataType.NUMBER
  },
  {
    header: "Stock",
    fieldName: "stock",
    dataType: DataType.NUMBER
  },
  {
    header: "Publicado",
    fieldName: "published",
    dataType: DataType.BOOLEAN
  },
  {
    header: "Acciones",
    fieldName: "action",
    dataType: DataType.ACTION
  }
]
