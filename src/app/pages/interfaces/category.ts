export interface Category {

  idCategory: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ResponseCategories {
  statusCode: number;
  data: Array<Category>;
}
