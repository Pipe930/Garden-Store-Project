export interface Category {

  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface ResponseCategory {

  statusCode: number;
  message: string;
  data: Category[];
}
